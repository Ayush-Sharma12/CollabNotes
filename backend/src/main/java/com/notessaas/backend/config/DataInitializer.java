package com.notessaas.backend.config;

import com.notessaas.backend.entity.Tenant;
import com.notessaas.backend.entity.User;
import com.notessaas.backend.repository.TenantRepository;
import com.notessaas.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    // TODO: Inject PasswordEncoder when implementing security
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeTenants();
        initializeUsers();
    }

    private void initializeTenants() {
        // Create Acme tenant if it doesn't exist
        if (!tenantRepository.existsBySlug("acme")) {
            Tenant acme = new Tenant("Acme Corporation", "acme", Tenant.Plan.FREE);
            tenantRepository.save(acme);
            System.out.println("Created tenant: Acme Corporation");
        }

        // Create Globex tenant if it doesn't exist
        if (!tenantRepository.existsBySlug("globex")) {
            Tenant globex = new Tenant("Globex Corporation", "globex", Tenant.Plan.FREE);
            tenantRepository.save(globex);
            System.out.println("Created tenant: Globex Corporation");
        }
    }

    private void initializeUsers() {
        // TODO: Use passwordEncoder.encode("password") when implementing security
        String defaultPassword = "password"; // This should be encoded!
        
        // Create required test accounts
        createUserIfNotExists("admin@acme.test", defaultPassword, "Admin", "User", "acme", User.Role.ADMIN);
        createUserIfNotExists("user@acme.test", defaultPassword, "Regular", "User", "acme", User.Role.MEMBER);
        createUserIfNotExists("admin@globex.test", defaultPassword, "Admin", "User", "globex", User.Role.ADMIN);
        createUserIfNotExists("user@globex.test", defaultPassword, "Regular", "User", "globex", User.Role.MEMBER);
    }

    private void createUserIfNotExists(String email, String password, String firstName, String lastName, 
                                     String tenantSlug, User.Role role) {
        if (!userRepository.existsByEmailAndTenantSlug(email, tenantSlug)) {
            User user = new User(email, password, firstName, lastName, tenantSlug, role);
            userRepository.save(user);
            System.out.println("Created user: " + email + " for tenant: " + tenantSlug + " with role: " + role);
        }
    }
}