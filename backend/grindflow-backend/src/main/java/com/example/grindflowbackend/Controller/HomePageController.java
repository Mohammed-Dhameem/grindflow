package com.example.grindflowbackend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/homepage")
public class HomePageController {
    @GetMapping("/trigger")
    public ResponseEntity<?> trigger() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok("Welcome " + email);
    }

}
