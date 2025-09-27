package com.notessaas.backend.repository;

import com.notessaas.backend.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    
    // Find tenant by slug
    Optional<Tenant> findBySlug(String slug);
    
    // Check if tenant exists by slug
    boolean existsBySlug(String slug);
}