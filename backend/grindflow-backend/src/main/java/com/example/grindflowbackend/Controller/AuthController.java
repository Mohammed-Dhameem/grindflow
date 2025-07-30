package com.example.grindflowbackend.Controller;

import com.example.grindflowbackend.Configuration.JwtUtil;
import com.example.grindflowbackend.Model.ModelDto.LoginRequest;
import com.example.grindflowbackend.Model.ModelDto.SignupRequest;
import com.example.grindflowbackend.Model.User;
import com.example.grindflowbackend.Repository.UserRepository;
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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "Email is already registered"));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepo.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Collections.singletonMap("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        return userRepo.findByEmail(req.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                        String token = jwtUtil.generateToken(user.getEmail());

                        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                                .httpOnly(true)
                                .secure(false) // ❗Set to true in production (HTTPS only)
                                .path("/")
                                .maxAge(60 * 60 * 24) // 1 day
                                .sameSite("Lax")
                                .build();

                        response.setHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

                        return ResponseEntity.ok(Collections.singletonMap("message", "Login successful"));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Collections.singletonMap("error", "Invalid email or password"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Invalid email or password")));
    }

    @GetMapping("/protected")
    public ResponseEntity<?> protectedEndpoint(@CookieValue(value = "jwt", required = false) String token) {
        if (token == null || !jwtUtil.isTokenValid(token)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or missing token"));
        }

        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(Map.of("message", "You are authenticated", "email", email));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // delete cookie
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out"));
    }


}
