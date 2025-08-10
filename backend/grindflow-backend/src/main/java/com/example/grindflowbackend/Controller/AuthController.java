package com.example.grindflowbackend.Controller;

import com.example.grindflowbackend.Configuration.JwtUtil;
import com.example.grindflowbackend.Model.Enum.EnumeratedClass;
import com.example.grindflowbackend.Model.ModelDto.EmailVerification;
import com.example.grindflowbackend.Model.ModelDto.LoginRequest;
import com.example.grindflowbackend.Model.ModelDto.PasswordReset;
import com.example.grindflowbackend.Model.ModelDto.SignupRequest;
import com.example.grindflowbackend.Model.User;
import com.example.grindflowbackend.Repository.UserRepository;
import com.example.grindflowbackend.Service.EmailService;
import com.example.grindflowbackend.Service.GoogleService;
import com.example.grindflowbackend.Service.OtpService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GoogleService googleService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    // ================== SIGNUP ==================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already registered"));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setAuthProvider(EnumeratedClass.AuthProvider.LOCAL);
        userRepo.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    // ================== LOGIN ==================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        return userRepo.findByEmail(req.getEmail())
                .map(user -> {
                    if (user.getAuthProvider() != EnumeratedClass.AuthProvider.LOCAL) {
                        String providerName = user.getAuthProvider().name();
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("error", "You have previously signed in using " + providerName + ". Please continue with that platform."));
                    }

                    if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                        // Normal long-lived JWT for login session
                        String token = jwtUtil.generateTokenWithExpiry(user.getEmail(), 60 * 60 * 10);

                        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                                .httpOnly(true)
                                .secure(false) // Set true in prod (HTTPS)
                                .path("/")
                                .maxAge(60 * 60 * 24)
                                .sameSite("Lax")
                                .build();

                        response.setHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
                        return ResponseEntity.ok(Map.of("message", "Login successful"));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("error", "Invalid email or password"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid email or password")));
    }

    // ================== LOGOUT ==================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        invalidateCookie("jwt", response);
        invalidateCookie("reset_jwt", response);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    // Helper to clear cookies
    private void invalidateCookie(String name, HttpServletResponse response) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    // ================== GOOGLE LOGIN ==================
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String idToken = body.get("idToken");
        if (idToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing ID token"));
        }

        var payload = googleService.verifyToken(idToken);
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid ID token"));
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword("");
            newUser.setAuthProvider(EnumeratedClass.AuthProvider.GOOGLE);
            return userRepo.save(newUser);
        });

        String token = jwtUtil.generateTokenWithExpiry(email, 60 * 60 * 10);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60 * 24)
                .sameSite("Lax")
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Google login successful", "email", email));
    }

    // ================== OTP SEND ==================
    @PostMapping("/verifyAndSendOTP")
    public ResponseEntity<?> verifyAndSendOTP(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        return userRepo.findByEmail(email)
                .map(user -> {
                    if (user.getAuthProvider() != EnumeratedClass.AuthProvider.LOCAL) {
                        String providerName = user.getAuthProvider().name();
                        return ResponseEntity.status(400).body(Map.of(
                                "message", "Your account is linked with " + providerName + ". Please log in using " + providerName + "."
                        ));
                    }
                    String otp = otpService.generateOtpForEmail(user.getEmail());
                    emailService.sendOtpEmail(user.getEmail(), user.getName(), otp);
                    return ResponseEntity.ok(Map.of("message", "OTP sent. Please check your mail!"));
                })
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(Map.of("message", "User not found. Please check whether the entered email is correct!")));
    }

    // ================== OTP VERIFY ==================
    @PostMapping("/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestBody EmailVerification emailVerification,
                                       HttpServletResponse response) {
        EnumeratedClass.OtpStatus status = otpService.validateOtp(
                emailVerification.getEmail(),
                emailVerification.getOtp()
        );

        return switch (status) {
            case VALID -> {
                // Short-lived JWT (10 mins) for password reset
                String token = jwtUtil.generateTokenWithExpiry(emailVerification.getEmail(), 10 * 60);

                ResponseCookie resetCookie = ResponseCookie.from("reset_jwt", token)
                        .httpOnly(true)
                        .secure(false) // Set true in production
                        .path("/")
                        .maxAge(10 * 60)
                        .sameSite("lax")
                        .build();

                response.setHeader(HttpHeaders.SET_COOKIE, resetCookie.toString());
                yield ResponseEntity.ok(Map.of("message", "OTP validation successful"));
            }
            case EXPIRED -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "OTP expired"));
            case INVALID -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid OTP"));
        };
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(
            @CookieValue(value = "reset_jwt", required = false) String token,
            @RequestBody PasswordReset req) {

        if (token == null || !jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing reset token"));
        }

        String email = jwtUtil.extractEmail(token);
        System.out.println("Resetting password for: " + email);
        System.out.println(req);

        // TODO: Actually update the user's password in DB here

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }


    @GetMapping("/checkResetToken")
    public ResponseEntity<?> checkResetToken(
            @CookieValue(value = "reset_jwt", required = false) String token,
            HttpServletResponse response) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing reset token"));
        }

        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(Map.of("message", "Reset token valid", "email", email));
    }

    // ================== PROTECTED TEST ==================
    @GetMapping("/protected")
    public ResponseEntity<?> protectedEndpoint(@CookieValue(value = "jwt", required = false) String token) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(Map.of("message", "You are authenticated", "email", email));
    }
}
