package com.notessaas.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"})
public class NotesController {

    // TODO: Implement CRUD operations with tenant isolation
    // All operations must enforce tenant boundaries and role-based access
    
    @GetMapping
    public List<Map<String, Object>> getAllNotes() {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Fetch notes for user's tenant only
        // 3. Apply pagination if needed
        
        return List.of(Map.of("message", "Get all notes - TO BE IMPLEMENTED"));
    }

    @GetMapping("/{id}")
    public Map<String, Object> getNoteById(@PathVariable Long id) {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Fetch note by ID
        // 3. Verify note belongs to user's tenant
        // 4. Return note or 404 if not found/not authorized
        
        return Map.of("message", "Get note by ID - TO BE IMPLEMENTED", "id", id);
    }

    @PostMapping
    public Map<String, Object> createNote(@RequestBody Map<String, String> noteRequest) {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Check subscription limits (Free plan: max 3 notes)
        // 3. Create note with tenant isolation
        // 4. Return created note
        
        return Map.of("message", "Create note - TO BE IMPLEMENTED");
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateNote(@PathVariable Long id, @RequestBody Map<String, String> noteRequest) {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Fetch note by ID
        // 3. Verify note belongs to user's tenant
        // 4. Update note
        // 5. Return updated note
        
        return Map.of("message", "Update note - TO BE IMPLEMENTED", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteNote(@PathVariable Long id) {
        // TODO: Implement
        // 1. Get current user from JWT
        // 2. Fetch note by ID
        // 3. Verify note belongs to user's tenant
        // 4. Delete note
        // 5. Return success message
        
        return Map.of("message", "Delete note - TO BE IMPLEMENTED", "id", id);
    }
}