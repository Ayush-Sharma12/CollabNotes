// Demo authentication utilities for multi-tenant SaaS notes application
// Exactly matching the specified requirements

import { users, tenants } from '../data/demoData.js'

// Demo credentials - exactly as specified in requirements
// All passwords are 'password'
const DEMO_CREDENTIALS = {
  'admin@acme.test': {
    password: 'password',
    user: {
      id: 'user-1',
      email: 'admin@acme.test',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN', // Admin role
      tenantId: 'acme',
      tenantSlug: 'acme',
      tenantName: 'Acme Corporation',
      permissions: ['notes:read', 'notes:write', 'notes:delete', 'users:invite', 'tenant:manage']
    }
  },
  'user@acme.test': {
    password: 'password',
    user: {
      id: 'user-2',
      email: 'user@acme.test',
      firstName: 'Regular',
      lastName: 'User',
      role: 'MEMBER', // Member role
      tenantId: 'acme',
      tenantSlug: 'acme',
      tenantName: 'Acme Corporation',
      permissions: ['notes:read', 'notes:write', 'notes:delete']
    }
  },
  'admin@globex.test': {
    password: 'password',
    user: {
      id: 'user-3',
      email: 'admin@globex.test',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN', // Admin role
      tenantId: 'globex',
      tenantSlug: 'globex',
      tenantName: 'Globex Corporation',
      permissions: ['notes:read', 'notes:write', 'notes:delete', 'users:invite', 'tenant:manage']
    }
  },
  'user@globex.test': {
    password: 'password',
    user: {
      id: 'user-4',
      email: 'user@globex.test',
      firstName: 'Regular',
      lastName: 'User',
      role: 'MEMBER', // Member role
      tenantId: 'globex',
      tenantSlug: 'globex',
      tenantName: 'Globex Corporation',
      permissions: ['notes:read', 'notes:write', 'notes:delete']
    }
  }
};

export const demoLogin = (email, password = 'password') => {
  // Find user in credentials
  const credentials = DEMO_CREDENTIALS[email];
  if (!credentials || credentials.password !== password) {
    throw new Error('Invalid email or password');
  }

  const user = credentials.user;
  const tenant = tenants[user.tenantSlug];
  
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // Generate proper JWT payload
  const payload = {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    tenantId: user.tenantId,
    tenantSlug: user.tenantSlug,
    tenantName: user.tenantName,
    permissions: user.permissions,
    plan: tenant.plan,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  };

  // Create proper JWT token (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature-' + user.id);
  const mockToken = `${header}.${payloadStr}.${signature}`;
  
  return {
    token: mockToken,
    user: payload,
    tenant: tenant
  };
};

export const validateToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

export const getCurrentUser = (token) => {
  const payload = validateToken(token);
  if (!payload) {
    return null;
  }

  return payload;
};

// Demo accounts for display on login page
export const demoAccounts = [
  {
    email: 'admin@acme.test',
    password: 'password',
    name: 'Admin User',
    role: 'Admin',
    tenant: 'Acme Corporation',
    plan: 'Free'
  },
  {
    email: 'user@acme.test', 
    password: 'password',
    name: 'Regular User',
    role: 'Member',
    tenant: 'Acme Corporation',
    plan: 'Free'
  },
  {
    email: 'admin@globex.test',
    password: 'password',
    name: 'Admin User',
    role: 'Admin',
    tenant: 'Globex Corporation',
    plan: 'Free'
  },
  {
    email: 'user@globex.test',
    password: 'password',
    name: 'Regular User',
    role: 'Member',
    tenant: 'Globex Corporation',
    plan: 'Free'
  }
];

// Utility functions
export const canInviteUsers = (userRole) => {
  return userRole === 'ADMIN';
};

export const canManageTenant = (userRole) => {
  return userRole === 'ADMIN';
};

export const canUpgradeSubscription = (userRole) => {
  return userRole === 'ADMIN';
};

export const getTenantInfo = (tenantSlug) => {
  return tenants[tenantSlug] || null;
};

// Mock signup function for compatibility
export const demoSignup = (userData, tenantData = null) => {
  // In demo mode, signup is not implemented
  throw new Error('Signup not implemented in demo mode');
};
