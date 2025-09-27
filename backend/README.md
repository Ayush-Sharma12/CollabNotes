# Multi-Tenant SaaS Notes Application - Backend

This is a Spring Boot backend for a multi-tenant SaaS notes application with JWT authentication, role-based access control, and subscription management.

## 🏗️ Multi-Tenancy Architecture

**Chosen Approach: Shared Schema with Tenant ID Column**

This implementation uses a **shared schema with tenant ID column** approach for multi-tenancy:

### Why This Approach?

1. **Cost-Effective**: Single database reduces infrastructure costs
2. **Easy Maintenance**: One schema to maintain and update
3. **Resource Efficiency**: Shared resources across tenants
4. **Simpler Deployment**: Single application instance serves all tenants

### How It Works:

- Each entity (User, Note) has a `tenantSlug` column
- All database queries include tenant filtering
- Repository methods enforce tenant boundaries
- JWT tokens contain tenant information for request isolation

### Data Isolation Strategy:

```java
// Example: Notes are always filtered by tenant
@Query("SELECT n FROM Note n WHERE n.tenantSlug = :tenantSlug")
List<Note> findByTenantSlug(@Param("tenantSlug") String tenantSlug);
```

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Login generates JWT tokens containing user and tenant information
- All protected endpoints validate JWT tokens
- Tokens include user role and tenant context

### Role-Based Access Control

**Admin Users Can:**
- Create, view, edit, delete all notes in their tenant
- Invite new users to their tenant
- Upgrade tenant subscription plans
- Access tenant management features

**Member Users Can:**
- Create, view, edit, delete their own notes only
- Cannot access admin features
- Cannot invite users or manage subscriptions

## 📋 Required Test Accounts

The application initializes with these mandatory test accounts (password: `password`):

```
admin@acme.test    - Admin role, Acme tenant
user@acme.test     - Member role, Acme tenant
admin@globex.test  - Admin role, Globex tenant
user@globex.test   - Member role, Globex tenant
```

## 💰 Subscription Plans

### Free Plan
- Maximum 3 notes per tenant
- Basic features only
- All tenants start with Free plan

### Pro Plan
- Unlimited notes
- Advanced features
- Upgraded via Admin-only endpoint

## 🚀 API Endpoints

### Health Check
```http
GET /api/health
Response: {"status": "ok"}
```

### Authentication
```http
POST /api/auth/login
Body: {"email": "user@acme.test", "password": "password"}

GET /api/auth/me
Headers: Authorization: Bearer <jwt-token>
```

### Notes (CRUD with Tenant Isolation)
```http
GET /api/notes
POST /api/notes
GET /api/notes/{id}
PUT /api/notes/{id}
DELETE /api/notes/{id}

Headers: Authorization: Bearer <jwt-token>
```

### Tenant Management
```http
POST /api/tenants/{slug}/upgrade     # Admin only
GET /api/tenants/{slug}
POST /api/tenants/{slug}/invite      # Admin only

Headers: Authorization: Bearer <jwt-token>
```

## 🛠️ Technology Stack

- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Database abstraction
- **Spring Security** - Authentication & authorization
- **H2 Database** - Development database
- **PostgreSQL** - Production database support
- **Auth0 JWT** - JWT token handling
- **Maven** - Dependency management

## 📁 Project Structure

```
src/main/java/com/notessaas/backend/
├── NotesSaasBackendApplication.java    # Main application class
├── controller/                         # REST controllers
│   ├── AuthController.java            # Authentication endpoints
│   ├── HealthController.java          # Health check
│   ├── NotesController.java           # Notes CRUD
│   └── TenantController.java          # Tenant management
├── entity/                            # JPA entities
│   ├── Note.java                      # Note entity
│   ├── Tenant.java                    # Tenant entity
│   └── User.java                      # User entity
├── repository/                        # Data access layer
│   ├── NoteRepository.java            # Note queries
│   ├── TenantRepository.java          # Tenant queries
│   └── UserRepository.java            # User queries
└── config/                           # Configuration
    └── DataInitializer.java          # Test data setup
```

## ⚙️ Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=jdbc:h2:mem:testdb
DB_DRIVER=org.h2.Driver
DB_USERNAME=sa
DB_PASSWORD=

# JWT
JWT_SECRET=your-very-secure-secret-key-change-this-in-production
JWT_EXPIRATION=86400000

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://*.vercel.app

# Logging
LOG_LEVEL=DEBUG
```

### Production Database (PostgreSQL)

```bash
DATABASE_URL=postgresql://username:password@host:port/database
DB_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
DDL_AUTO=validate
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Development Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd notes-saas-backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access H2 Console (development)**
   ```
   http://localhost:8080/api/h2-console
   JDBC URL: jdbc:h2:mem:testdb
   Username: sa
   Password: (empty)
   ```

5. **Test health endpoint**
   ```bash
   curl http://localhost:8080/api/health
   ```

## 🚀 Deployment to Vercel

### Vercel Configuration

Create `vercel.json` in the backend root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "pom.xml",
      "use": "@vercel/java"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/target/notes-saas-backend-0.0.1-SNAPSHOT.jar"
    }
  ]
}
```

### Environment Variables for Production

Set in Vercel dashboard:
```bash
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-production-secret-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app
DDL_AUTO=update
```

## 🔧 Implementation TODO List

The following features need to be implemented:

### High Priority
1. **JWT Security Configuration**
   - Configure Spring Security
   - Implement JWT token generation/validation
   - Add password encoding

2. **Authentication Service**
   - Implement login logic in AuthController
   - Add JWT token validation middleware
   - Create user details service

3. **Notes CRUD Implementation**
   - Complete NotesController methods
   - Add subscription limit validation
   - Implement tenant isolation in all operations

4. **Tenant Management**
   - Implement subscription upgrade logic
   - Add user invitation system
   - Create admin-only access controls

### Medium Priority
5. **Exception Handling**
   - Global exception handler
   - Custom exceptions for business logic
   - Proper HTTP status codes

6. **Input Validation**
   - Request validation
   - Sanitization
   - Error messages

7. **Testing**
   - Unit tests for services
   - Integration tests for controllers
   - Database tests

### Low Priority
8. **Monitoring & Logging**
   - Application metrics
   - Structured logging
   - Performance monitoring

9. **API Documentation**
   - Swagger/OpenAPI integration
   - API documentation generation

## 🧪 Testing Strategy

### Automated Test Validation

The application will be tested for:
- ✅ Health endpoint availability
- ✅ Successful login for all predefined accounts
- ✅ Tenant isolation enforcement
- ✅ Role-based access restrictions
- ✅ Free plan note limit (3 notes max)
- ✅ Pro plan upgrade functionality
- ✅ CRUD operations with proper isolation

### Manual Testing

Use tools like Postman or curl to test:
1. Login with each test account
2. Create notes and verify tenant isolation
3. Test subscription limits
4. Verify admin-only features

## 🔒 Security Considerations

### Current Implementation Status
⚠️ **SECURITY WARNING**: The current implementation is a skeleton for development only.

### Required Security Implementations
1. **Password Encryption**: Implement BCrypt password hashing
2. **JWT Validation**: Add proper JWT signature validation
3. **CORS Security**: Configure production CORS policies
4. **SQL Injection**: Use parameterized queries (already implemented via JPA)
5. **Input Validation**: Add comprehensive request validation
6. **Rate Limiting**: Implement API rate limiting
7. **HTTPS**: Ensure HTTPS in production

## 📝 License

This project is part of a SaaS application development challenge.