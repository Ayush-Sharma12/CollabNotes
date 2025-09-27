// Demo data for multi-tenant SaaS notes application
// Required test accounts and tenant configuration

// Mock tenant data - exactly as specified in requirements
export const tenants = {
  'acme': {
    id: 'acme',
    name: 'Acme Corporation',
    slug: 'acme',
    plan: 'FREE', // All tenants start with FREE plan
    settings: {
      features: {
        maxUsers: -1, // unlimited users
        maxNotes: 3, // FREE plan limit
        storage: '1GB',
        customBranding: false,
        apiAccess: false,
        prioritySupport: false,
      }
    },
    usage: {
      users: 2, // admin@acme.test + user@acme.test
      notes: 2,
      storage: '0.1GB'
    },
    createdAt: '2024-01-15',
    subscription: {
      plan: 'FREE',
      status: 'active',
      renewalDate: null
    }
  },
  'globex': {
    id: 'globex',
    name: 'Globex Corporation',
    slug: 'globex',
    plan: 'FREE', // All tenants start with FREE plan
    settings: {
      features: {
        maxUsers: -1, // unlimited users
        maxNotes: 3, // FREE plan limit
        storage: '1GB',
        customBranding: false,
        apiAccess: false,
        prioritySupport: false,
      }
    },
    usage: {
      users: 2, // admin@globex.test + user@globex.test
      notes: 1,
      storage: '0.05GB'
    },
    createdAt: '2024-03-20',
    subscription: {
      plan: 'FREE',
      status: 'active',
      renewalDate: null
    }
  }
};

// Mock users data - exactly as specified in requirements
// All passwords are 'password'
export const users = {
  'admin@acme.test': {
    id: 'user-1',
    email: 'admin@acme.test',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN', // Admin role
    tenantId: 'acme',
    tenantSlug: 'acme',
    status: 'active',
    lastLogin: '2024-12-01T10:30:00Z',
    createdAt: '2024-01-15',
    permissions: ['notes:read', 'notes:write', 'notes:delete', 'users:invite', 'tenant:manage']
  },
  'user@acme.test': {
    id: 'user-2',
    email: 'user@acme.test',
    firstName: 'Regular',
    lastName: 'User',
    role: 'MEMBER', // Member role
    tenantId: 'acme',
    tenantSlug: 'acme',
    status: 'active',
    lastLogin: '2024-12-01T09:15:00Z',
    createdAt: '2024-02-20',
    permissions: ['notes:read', 'notes:write', 'notes:delete']
  },
  'admin@globex.test': {
    id: 'user-3',
    email: 'admin@globex.test',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN', // Admin role
    tenantId: 'globex',
    tenantSlug: 'globex',
    status: 'active',
    lastLogin: '2024-11-30T16:45:00Z',
    createdAt: '2024-03-20',
    permissions: ['notes:read', 'notes:write', 'notes:delete', 'users:invite', 'tenant:manage']
  },
  'user@globex.test': {
    id: 'user-4',
    email: 'user@globex.test',
    firstName: 'Regular',
    lastName: 'User',
    role: 'MEMBER', // Member role
    tenantId: 'globex',
    tenantSlug: 'globex',
    status: 'active',
    lastLogin: '2024-11-30T14:20:00Z',
    createdAt: '2024-04-10',
    permissions: ['notes:read', 'notes:write', 'notes:delete']
  }
};

// Plans configuration
export const plans = {
  FREE: {
    name: 'Free',
    maxNotes: 3,
    price: 0,
    features: ['Basic notes', 'Limited storage', 'Community support']
  },
  PRO: {
    name: 'Pro',
    maxNotes: -1, // unlimited
    price: 29,
    features: ['Unlimited notes', 'Advanced features', 'Priority support', 'API access']
  }
};

// Mock tenant data for display (compatible with existing components)
export const demoTenants = [
  {
    id: 'acme',
    name: 'Acme Corporation',
    domain: 'acme.notesaas.com',
    plan: 'FREE',
    status: 'active',
    users: 2,
    maxUsers: -1,
    notes: 2,
    maxNotes: 3,
    storage: '0.1GB',
    maxStorage: '1GB',
    createdAt: new Date('2024-01-15'),
    billing: null // Free plan has no billing
  },
  {
    id: 'globex',
    name: 'Globex Corporation',
    domain: 'globex.notesaas.com',
    plan: 'FREE',
    status: 'active',
    users: 2,
    maxUsers: -1,
    notes: 1,
    maxNotes: 3,
    storage: '0.05GB',
    maxStorage: '1GB',
    createdAt: new Date('2024-03-20'),
    billing: null // Free plan has no billing
  }
]

// Mock user data for display (compatible with existing components)
export const demoUsers = [
  {
    id: 'user-1',
    email: 'admin@acme.test',
    name: 'Admin User',
    role: 'tenant_admin',
    tenantId: 'acme',
    avatar: null,
    lastActive: new Date(),
    status: 'active'
  },
  {
    id: 'user-2',
    email: 'user@acme.test',
    name: 'Regular User',
    role: 'tenant_user',
    tenantId: 'acme',
    avatar: null,
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'active'
  },
  {
    id: 'user-3',
    email: 'admin@globex.test',
    name: 'Admin User',
    role: 'tenant_admin',
    tenantId: 'globex',
    avatar: null,
    lastActive: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    status: 'active'
  },
  {
    id: 'user-4',
    email: 'user@globex.test',
    name: 'Regular User',
    role: 'tenant_user',
    tenantId: 'globex',
    avatar: null,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'active'
  }
]

// Mock notes data with strict tenant isolation
export const demoNotes = [
  // Acme Corporation notes (2 notes - under free limit)
  {
    id: '1',
    title: 'Welcome to Acme Corporation',
    content: `# Welcome to Acme Corporation Notes

This is a sample note for Acme Corporation. As a Free plan tenant, you can create up to 3 notes.

## Features Available:
- Create, edit, and delete notes
- Basic text formatting
- Note organization

**Current Plan**: Free (3 notes maximum)
**Upgrade to Pro**: Contact your admin to unlock unlimited notes!`,
    category: 'Welcome',
    tags: ['welcome', 'acme', 'getting-started'],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    isPinned: true,
    color: '#e3f2fd',
    tenantId: 'acme',
    tenantSlug: 'acme',
    authorId: 'user-1',
    authorEmail: 'admin@acme.test',
    authorName: 'Admin User'
  },
  {
    id: '2',
    title: 'Project Planning Notes',
    content: `# Project Planning - Q1 2024

## Objectives
- Complete system requirements
- Design user interface mockups
- Set up development environment

## Timeline
- Week 1: Requirements gathering
- Week 2-3: Design phase
- Week 4: Development setup

## Notes
This project is critical for our Q1 goals. Make sure to coordinate with all team members.

**Status**: In Progress
**Due Date**: March 31, 2024`,
    category: 'Projects',
    tags: ['planning', 'q1', 'project'],
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-25T09:15:00Z'),
    isPinned: false,
    color: '#fff3e0',
    tenantId: 'acme',
    tenantSlug: 'acme',
    authorId: 'user-2',
    authorEmail: 'user@acme.test',
    authorName: 'Regular User'
  },

  // Globex Corporation notes (1 note - under free limit)
  {
    id: '3',
    title: 'Globex Corporation Overview',
    content: `# Globex Corporation Notes System

Welcome to Globex Corporation's note-taking platform!

## Current Status
- **Plan**: Free (up to 3 notes)
- **Users**: 2 team members
- **Notes Created**: 1 of 3 available

## Getting Started
1. Create your first note
2. Organize with categories and tags
3. Collaborate with team members
4. Consider upgrading to Pro for unlimited notes

## Need More Notes?
Contact your administrator to upgrade to the Pro plan for unlimited note creation.

**Company**: Globex Corporation
**Plan**: Free Tier`,
    category: 'Company',
    tags: ['welcome', 'globex', 'overview'],
    createdAt: new Date('2024-03-20T16:00:00Z'),
    updatedAt: new Date('2024-03-21T10:30:00Z'),
    isPinned: true,
    color: '#e8f5e8',
    tenantId: 'globex',
    tenantSlug: 'globex',
    authorId: 'user-3',
    authorEmail: 'admin@globex.test',
    authorName: 'Admin User'
  }
];

// Categories for notes
export const demoCategories = [
  'Welcome',
  'Projects',
  'Company',
  'Planning',
  'Development',
  'All'
];

// Available tags
export const demoTags = [
  'welcome',
  'acme',
  'globex',
  'getting-started',
  'planning',
  'project',
  'overview',
  'company',
  'development'
];

// Utility functions for demo data with tenant isolation
export const getRandomNote = (tenantSlug = null) => {
  const filteredNotes = tenantSlug ? demoNotes.filter(note => note.tenantSlug === tenantSlug) : demoNotes;
  return filteredNotes[Math.floor(Math.random() * filteredNotes.length)];
};

export const getNotesByCategory = (category, tenantSlug = null) => {
  let filteredNotes = tenantSlug ? demoNotes.filter(note => note.tenantSlug === tenantSlug) : demoNotes;
  if (category === 'All') return filteredNotes;
  return filteredNotes.filter(note => note.category === category);
};

export const searchNotes = (query, tenantSlug = null) => {
  let filteredNotes = tenantSlug ? demoNotes.filter(note => note.tenantSlug === tenantSlug) : demoNotes;
  if (!query) return filteredNotes;
  const lowercaseQuery = query.toLowerCase();
  return filteredNotes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getPinnedNotes = (tenantSlug = null) => {
  let filteredNotes = tenantSlug ? demoNotes.filter(note => note.tenantSlug === tenantSlug) : demoNotes;
  return filteredNotes.filter(note => note.isPinned);
};

export const getRecentNotes = (limit = 5, tenantSlug = null) => {
  let filteredNotes = tenantSlug ? demoNotes.filter(note => note.tenantSlug === tenantSlug) : demoNotes;
  return [...filteredNotes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
};

// Tenant-specific utility functions
export const getNoteCountForTenant = (tenantSlug) => {
  return demoNotes.filter(note => note.tenantSlug === tenantSlug).length;
};

export const canCreateNote = (tenantSlug) => {
  const tenant = tenants[tenantSlug];
  if (!tenant) return false;
  
  const currentNoteCount = getNoteCountForTenant(tenantSlug);
  const maxNotes = tenant.settings.features.maxNotes;
  
  // If maxNotes is -1, it means unlimited
  if (maxNotes === -1) return true;
  
  return currentNoteCount < maxNotes;
};

export const getNoteLimitInfo = (tenantSlug) => {
  const tenant = tenants[tenantSlug];
  if (!tenant) return null;
  
  const currentNoteCount = getNoteCountForTenant(tenantSlug);
  const maxNotes = tenant.settings.features.maxNotes;
  
  return {
    current: currentNoteCount,
    max: maxNotes,
    canCreate: canCreateNote(tenantSlug),
    remaining: maxNotes === -1 ? 'unlimited' : maxNotes - currentNoteCount
  };
};
