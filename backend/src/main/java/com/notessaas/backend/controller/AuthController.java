package com.notessaas.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"})
public class AuthController {

    // TODO: Implement JWT-based authentication
    // Required endpoints:
    // POST /auth/login
    // POST /auth/register (if needed)
    // GET /auth/me (get current user info)

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        // TODO: Implement login logic
        // 1. Validate email and password
        // 2. Check user exists and belongs to tenant
        // 3. Generate JWT token
        // 4. Return user info with token
        
        return Map.of(
            "message", "Login endpoint - TO BE IMPLEMENTED",
            "email", loginRequest.get("email")
        );
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        // TODO: Implement current user retrieval
        // 1. Extract JWT from Authorization header
        // 2. Validate token
        // 3. Return current user info
        
        return Map.of("message", "Get current user - TO BE IMPLEMENTED");
    }
}