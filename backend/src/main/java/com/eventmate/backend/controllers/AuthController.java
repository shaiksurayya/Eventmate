package com.eventmate.backend.controllers;

import com.eventmate.backend.models.User;
import com.eventmate.backend.payload.request.LoginRequest;
import com.eventmate.backend.payload.request.OtpRequest;
import com.eventmate.backend.payload.request.PasswordResetRequest;
import com.eventmate.backend.payload.response.JwtResponse;
import com.eventmate.backend.repositories.UserRepository;
import com.eventmate.backend.security.JwtUtil;
import com.eventmate.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional; // Import Optional
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email is already in use!");
        }
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after successful authentication"));
            
            final UserDetails userDetails = user;
            final String jwt = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password.");
        }
    }

    // ---------------- VERIFY OTP ----------------
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest otpRequest) {
        // --- FIX #2 ---
        Optional<User> userOptional = userRepository.findByEmail(otpRequest.getEmail());
        if (userOptional.isEmpty() || userOptional.get().getOtp() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid request or OTP already verified.");
        }
        User user = userOptional.get();

        if (user.getOtpGeneratedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: OTP has expired.");
        }
        if (user.getOtp().equals(otpRequest.getOtp())) {
            user.setOtp(null);
            user.setOtpGeneratedTime(null);
            userRepository.save(user);
            final UserDetails userDetails = user;
            final String jwt = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponse(jwt));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid OTP.");
    }

    // ---------------- FORGOT PASSWORD ----------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody LoginRequest loginRequest) {
        // --- FIX #3 ---
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            // This is correct for security, to not reveal if an email exists
            return ResponseEntity.ok("If an account with this email exists, an OTP has been sent.");
        }
        User user = userOptional.get();

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setOtpGeneratedTime(LocalDateTime.now());
        userRepository.save(user);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
            return ResponseEntity.ok("OTP for password reset has been sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Could not send OTP email.");
        }
    }

    // ---------------- RESET PASSWORD ----------------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        // --- FIX #4 ---
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty() || userOptional.get().getOtp() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid request or OTP not requested.");
        }
        User user = userOptional.get();

        if (user.getOtpGeneratedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: OTP has expired.");
        }

        if (user.getOtp().equals(request.getOtp())) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setOtp(null);
            user.setOtpGeneratedTime(null);
            userRepository.save(user);

            return ResponseEntity.ok("Password has been reset successfully. Please login with your new password.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid OTP.");
    }
}