package com.eventmate.backend.security;

// --- SAARI ZAROORI IMPORTS (DONO FILES SE) ---
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; 
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; 
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity 
@EnableMethodSecurity 
public class SecurityConfig {

    // --- SAARI ZAROORI FIELDS (DONO FILES SE) ---
    @Autowired
    private JwtAuthFilter authFilter; 

    @Autowired
    private UserDetailsService userDetailsService; // Dono mein common

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler; // Surayya ka 401 Error Handler

    // --- CORE BEANS (DONO MEIN COMMON) ---
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // --- AAPKA CORS BEAN (YEH SAHI CHAL RAHA THA) ---
    
    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:5173",
        "https://eventmate-pi.vercel.app",
        "https://*.vercel.app"
    ));

    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS"
    ));

    configuration.setAllowedHeaders(Arrays.asList("*"));

    configuration.setExposedHeaders(Arrays.asList("Authorization"));

    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
}

    // --- MUKHYA MERGED FILTER CHAIN ---
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                
                .authorizeHttpRequests(auth -> auth

        // Authentication
        .requestMatchers("/api/auth/**").permitAll()

        // Public APIs
        .requestMatchers("/api/newsletter/**").permitAll()
        .requestMatchers("/api/contact/**").permitAll()
        .requestMatchers("/api/chat/**").permitAll()
        .requestMatchers("/api/bot/**").permitAll()
        .requestMatchers("/api/project-qa/**").permitAll()
        .requestMatchers("/api/contact-eventmate/**").permitAll()

        // Hall APIs
        .requestMatchers("/api/halls/**").permitAll()
        .requestMatchers("/api/managehalls/**").permitAll()

        // Booking APIs
        .requestMatchers("/api/bookings/all").permitAll()
        .requestMatchers("/api/bookings/hall/**").permitAll()   // ✅ FIX
        .requestMatchers("/api/bookings/{bookingId}/status").permitAll()
        .requestMatchers("/api/managehallbookings/**").permitAll()

        // Photographer APIs
        .requestMatchers("/api/photographers/available").permitAll()
        .requestMatchers("/api/photographers/{id}").permitAll()
        .requestMatchers("/api/photographers/all").permitAll()

        // Planner APIs
        .requestMatchers("/api/planners/available").permitAll()
        .requestMatchers("/api/planners/{id}").permitAll()

        // Protected APIs
        .requestMatchers("/api/bookings/**").authenticated()
        .requestMatchers("/api/photographers/book").authenticated()
        .requestMatchers("/api/planners/book").authenticated()

        .anyRequest().authenticated()
)
                
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}

