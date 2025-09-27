package com.notessaas.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tenants")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"})
public class TenantController {

    // TODO: Implement tenant management and subscription features
    // Only Admin users should be able to access these endpoints
    
    @PostMapping("/{slug}/upgrade")
    public Map<String, Object> upgradeTenant(@PathVariable String slug) {
        // TODO: Implement subscription upgrade
        // 1. Get current user from JWT
        // 2. Verify user is Admin for the tenant
        // 3. Upgrade tenant from FREE to PRO
        // 4. Update subscription limits immediately
        // 5. Return updated tenant info
        
        return Map.of(
            "message", "Upgrade tenant - TO BE IMPLEMENTED",
            "tenantSlug", slug
        );
    }

    @GetMapping("/{slug}")
    public Map<String, Object> getTenantInfo(@PathVariable String slug) {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Verify user belongs to the tenant
        // 3. Return tenant information including plan and limits
        
        return Map.of(
            "message", "Get tenant info - TO BE IMPLEMENTED",
            "tenantSlug", slug
        );
    }

    @PostMapping("/{slug}/invite")
    public Map<String, Object> inviteUser(@PathVariable String slug, @RequestBody Map<String, String> inviteRequest) {
        // TODO: Implement user invitation (Admin only)
        // 1. Get current user from JWT
        // 2. Verify user is Admin for the tenant
        // 3. Create new user invitation
        // 4. Send invitation email (if email service is configured)
        // 5. Return success message
        
        return Map.of(
            "message", "Invite user - TO BE IMPLEMENTED",
            "tenantSlug", slug,
            "email", inviteRequest.get("email")
        );
    }
}