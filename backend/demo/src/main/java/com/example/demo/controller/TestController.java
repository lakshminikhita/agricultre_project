package com.example.demo.controller;

import com.example.demo.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/test")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("No authentication found");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok("Authenticated user: " + userPrincipal.getEmail() + 
                                ", Authorities: " + userPrincipal.getAuthorities());
    }
}