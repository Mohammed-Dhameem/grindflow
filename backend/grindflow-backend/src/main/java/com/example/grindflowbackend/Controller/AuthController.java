package com.example.grindflowbackend.Controller;

import com.example.grindflowbackend.Configuration.JwtUtil;
import com.example.grindflowbackend.Model.ModelDto.LoginRequest;
import com.example.grindflowbackend.Model.ModelDto.SignupRequest;
import com.example.grindflowbackend.Model.User;
import com.example.grindflowbackend.Repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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

                        Cookie jwtCookie = new Cookie("jwt", token);
                        jwtCookie.setHttpOnly(true);
                        jwtCookie.setSecure(true); // Only set to true in production (HTTPS)
                        jwtCookie.setPath("/");
                        jwtCookie.setMaxAge(60 * 60 * 24); // 1 day
                        jwtCookie.setAttribute("SameSite", "Strict");
                        response.addCookie(jwtCookie);

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
    public ResponseEntity<?> protectedEndpoint(@CookieValue("jwt") String token) {
        if (jwtUtil.isTokenValid(token)) {
            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok("Hello " + email);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
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
