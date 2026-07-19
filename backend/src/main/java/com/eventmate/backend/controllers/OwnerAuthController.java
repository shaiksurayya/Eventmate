//package com.eventmate.backend.controllers;
//
//import com.eventmate.backend.models.Owner;
//import com.eventmate.backend.payload.request.LoginRequest;
//import com.eventmate.backend.payload.request.SignupRequest;
//import com.eventmate.backend.repositories.OwnerRepository;
//import com.eventmate.backend.service.EmailService;
//import com.eventmate.backend.service.OwnerService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//import java.util.Random;
//
//@RestController
//@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
//public class OwnerAuthController {
//
//    @Autowired
//    private OwnerService ownerService;
//
//    @Autowired
//    private OwnerRepository ownerRepository;
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    // ---------------- OWNER SIGNUP ----------------
//    @PostMapping("/signup-owner")
//    public ResponseEntity<?> signupOwner(@RequestBody SignupRequest request) {
//        if (ownerRepository.findByEmail(request.getEmail()).isPresent()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email already in use!");
//        }
//
//        Owner owner = new Owner();
//        owner.setEmail(request.getEmail());
//        owner.setPassword(passwordEncoder.encode(request.getPassword()));
//        owner.setName(request.getName());
//        owner.setPhone(request.getPhone());
//
//        ownerRepository.save(owner);
//        return ResponseEntity.ok("Owner registered successfully!");
//    }
//
//    // ---------------- OWNER LOGIN ----------------
//    @PostMapping("/login-owner")
//    public ResponseEntity<?> loginOwner(@RequestBody LoginRequest loginRequest) {
//        Optional<Owner> ownerOpt = ownerRepository.findByEmail(loginRequest.getEmail());
//        if (ownerOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password.");
//        }
//
//        Owner owner = ownerOpt.get();
//        if (!passwordEncoder.matches(loginRequest.getPassword(), owner.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password.");
//        }
//
//        // Generate OTP
//        String otp = String.format("%06d", new Random().nextInt(999999));
//        owner.setOtp(otp);
//        owner.setOtpGeneratedTime(LocalDateTime.now());
//        ownerRepository.save(owner);
//
//        try {
//            emailService.sendOtpEmail(owner.getEmail(), otp);
//            return ResponseEntity.ok("OTP sent to your email. Please verify.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error: Could not send OTP email.");
//        }
//    }
//
//    // ---------------- OWNER FORGOT PASSWORD ----------------
//    @PostMapping("/forgot-password-owner")
//    public ResponseEntity<?> forgotPassword(@RequestBody LoginRequest loginRequest) {
//        Optional<Owner> ownerOpt = ownerRepository.findByEmail(loginRequest.getEmail());
//        if (ownerOpt.isEmpty()) {
//            return ResponseEntity.ok("If an account with this email exists, an OTP has been sent.");
//        }
//
//        Owner owner = ownerOpt.get();
//        String otp = String.format("%06d", new Random().nextInt(999999));
//        owner.setOtp(otp);
//        owner.setOtpGeneratedTime(LocalDateTime.now());
//        ownerRepository.save(owner);
//
//        try {
//            emailService.sendOtpEmail(owner.getEmail(), otp);
//            return ResponseEntity.ok("OTP for password reset has been sent to your email.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Could not send OTP email.");
//        }
//    }
//}















package com.eventmate.backend.controllers;

import com.eventmate.backend.models.Owner;
import com.eventmate.backend.payload.request.LoginRequest;
import com.eventmate.backend.payload.request.SignupRequest;
import com.eventmate.backend.repositories.OwnerRepository;
import com.eventmate.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerAuthController {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------------- OWNER SIGNUP ----------------
    @PostMapping("/signup-owner")
    public ResponseEntity<?> signupOwner(@RequestBody SignupRequest request) {
        if (ownerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email already in use!");
        }

        Owner owner = new Owner();
        owner.setEmail(request.getEmail());
        owner.setPassword(passwordEncoder.encode(request.getPassword()));
        owner.setName(request.getName());
        owner.setPhone(request.getPhone());

        ownerRepository.save(owner);
        return ResponseEntity.ok("Owner registered successfully!");
    }

    // ---------------- OWNER LOGIN ----------------
    @PostMapping("/login-owner")
    public ResponseEntity<?> loginOwner(@RequestBody LoginRequest loginRequest) {
        Optional<Owner> ownerOpt = ownerRepository.findByEmail(loginRequest.getEmail());
        if (ownerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password.");
        }

        Owner owner = ownerOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), owner.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password.");
        }

        return ResponseEntity.ok("Owner logged in successfully!");
    }

    // ---------------- VERIFY OTP ----------------
    @PostMapping("/verify-otp-owner")
    public ResponseEntity<?> verifyOtp(@RequestBody LoginRequest otpRequest) {
        Optional<Owner> ownerOpt = ownerRepository.findByEmail(otpRequest.getEmail());

        if (ownerOpt.isEmpty() || ownerOpt.get().getOtp() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Invalid request or OTP not generated.");
        }

        Owner owner = ownerOpt.get();

        // Check if OTP is expired (valid 5 minutes)
        if (owner.getOtpGeneratedTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: OTP has expired.");
        }

        // Verify OTP (password field contains OTP)
        if (owner.getOtp().equals(otpRequest.getPassword())) {
            owner.setOtp(null);
            owner.setOtpGeneratedTime(null);
            ownerRepository.save(owner);
            return ResponseEntity.ok("OTP verified successfully. Owner logged in.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid OTP.");
    }

    // ---------------- OWNER FORGOT PASSWORD ----------------
    @PostMapping("/forgot-password-owner")
    public ResponseEntity<?> forgotPassword(@RequestBody LoginRequest loginRequest) {
        Optional<Owner> ownerOpt = ownerRepository.findByEmail(loginRequest.getEmail());
        if (ownerOpt.isEmpty()) {
            return ResponseEntity.ok("If an account with this email exists, an OTP has been sent.");
        }

        Owner owner = ownerOpt.get();
        String otp = String.format("%06d", new Random().nextInt(999999));
        owner.setOtp(otp);
        owner.setOtpGeneratedTime(LocalDateTime.now());
        ownerRepository.save(owner);

        try {
            emailService.sendOtpEmail(owner.getEmail(), otp);
            return ResponseEntity.ok("OTP for password reset has been sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Could not send OTP email.");
        }
    }
}

