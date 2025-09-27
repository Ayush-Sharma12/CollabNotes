package com.notessaas.backend.repository;

import com.notessaas.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email (for authentication)
    Optional<User> findByEmail(String email);
    
    // Find users by tenant slug (for tenant isolation)
    List<User> findByTenantSlug(String tenantSlug);
    
    // Find user by email and tenant slug (for login validation)
    Optional<User> findByEmailAndTenantSlug(String email, String tenantSlug);
    
    // Count users in a tenant
    @Query("SELECT COUNT(u) FROM User u WHERE u.tenantSlug = :tenantSlug")
    long countByTenantSlug(@Param("tenantSlug") String tenantSlug);
    
    // Find admin users for a tenant
    @Query("SELECT u FROM User u WHERE u.tenantSlug = :tenantSlug AND u.role = 'ADMIN'")
    List<User> findAdminsByTenantSlug(@Param("tenantSlug") String tenantSlug);
    
    // Check if user exists by email and tenant
    boolean existsByEmailAndTenantSlug(String email, String tenantSlug);
}