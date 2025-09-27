package com.notessaas.backend.repository;

import com.notessaas.backend.entity.Note;
import com.notessaas.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    // Find all notes for a tenant (tenant isolation)
    List<Note> findByTenantSlugOrderByUpdatedAtDesc(String tenantSlug);
    
    // Find notes by user (user's own notes)
    List<Note> findByUserOrderByUpdatedAtDesc(User user);
    
    // Find notes by user and tenant (double isolation)
    List<Note> findByUserAndTenantSlugOrderByUpdatedAtDesc(User user, String tenantSlug);
    
    // Find a specific note with tenant and user isolation
    @Query("SELECT n FROM Note n WHERE n.id = :id AND n.tenantSlug = :tenantSlug AND n.user = :user")
    Optional<Note> findByIdAndTenantSlugAndUser(@Param("id") Long id, 
                                                @Param("tenantSlug") String tenantSlug, 
                                                @Param("user") User user);
    
    // Find a specific note with tenant isolation only (for admin access)
    Optional<Note> findByIdAndTenantSlug(Long id, String tenantSlug);
    
    // Count notes for a tenant (for subscription limits)
    @Query("SELECT COUNT(n) FROM Note n WHERE n.tenantSlug = :tenantSlug")
    long countByTenantSlug(@Param("tenantSlug") String tenantSlug);
    
    // Count notes for a specific user
    @Query("SELECT COUNT(n) FROM Note n WHERE n.user = :user")
    long countByUser(@Param("user") User user);
    
    // Count notes for a user in a tenant
    @Query("SELECT COUNT(n) FROM Note n WHERE n.user = :user AND n.tenantSlug = :tenantSlug")
    long countByUserAndTenantSlug(@Param("user") User user, @Param("tenantSlug") String tenantSlug);
}