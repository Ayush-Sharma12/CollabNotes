import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../services/api'
import { demoLogin, demoSignup } from '../utils/demoAuth.js'

const TOKEN_KEY = 'token'
const TENANT_KEY = 'tenant_info'

export const AuthContext = createContext(null)

// Subscription plans with features
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: 'Starter',
    price: 0,
    interval: 'month',
    features: {
      maxUsers: 3,
      maxNotes: 100,
      storage: '1GB',
      collaboration: false,
      analytics: false,
      customBranding: false,
      apiAccess: false,
      support: 'Community'
    }
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 29,
    interval: 'month',
    features: {
      maxUsers: 25,
      maxNotes: 5000,
      storage: '50GB',
      collaboration: true,
      analytics: true,
      customBranding: false,
      apiAccess: true,
      support: 'Email'
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: {
      maxUsers: -1, // Unlimited
      maxNotes: -1, // Unlimited
      storage: '500GB',
      collaboration: true,
      analytics: true,
      customBranding: true,
      apiAccess: true,
      support: 'Priority'
    }
  }
}

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin',
  TENANT_USER: 'tenant_user',
  MEMBER: 'member'
}

function parseToken(token) {
  try {
    const decoded = jwtDecode(token)
    return {
      id: decoded?.sub || decoded?.id,
      email: decoded?.email,
      role: decoded?.role || USER_ROLES.MEMBER,
      tenantId: decoded?.tenantId || decoded?.tenant_id,
      tenantRole: decoded?.tenantRole || 'member',
      plan: decoded?.plan || 'STARTER',
      permissions: decoded?.permissions || [],
      exp: decoded?.exp,
      iat: decoded?.iat
    }
  } catch (e) {
    console.error('Token parsing error:', e)
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user, setUser] = useState(() => (token ? parseToken(token) : null))
  const [tenant, setTenant] = useState(() => {
    const saved = localStorage.getItem(TENANT_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  // Check token expiration
  useEffect(() => {
    if (token && user?.exp) {
      const now = Date.now() / 1000
      if (user.exp < now) {
        console.log('Token expired, logging out')
        logout()
      }
    }
  }, [token, user])

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      const parsedUser = parseToken(token)
      setUser(parsedUser)
      
      // Fetch tenant information if user has tenantId
      if (parsedUser?.tenantId) {
        fetchTenantInfo(parsedUser.tenantId)
      }
    } else {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TENANT_KEY)
      setUser(null)
      setTenant(null)
    }
  }, [token])

  useEffect(() => {
    if (tenant) {
      localStorage.setItem(TENANT_KEY, JSON.stringify(tenant))
    }
  }, [tenant])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY) {
        setToken(e.newValue)
      } else if (e.key === TENANT_KEY) {
        setTenant(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const fetchTenantInfo = async (tenantId) => {
    try {
      // In a real app, this would fetch from API
      // For demo, we'll use mock data
      const mockTenant = {
        id: tenantId,
        name: `Company ${tenantId.slice(-4).toUpperCase()}`,
        domain: `company-${tenantId.slice(-4)}.example.com`,
        plan: user?.plan || 'STARTER',
        settings: {
          branding: {
            logo: null,
            primaryColor: '#6366f1',
            secondaryColor: '#ec4899'
          },
          features: SUBSCRIPTION_PLANS[user?.plan || 'STARTER'].features
        },
        usage: {
          users: 5,
          notes: 247,
          storage: '2.5GB'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
      setTenant(mockTenant)
    } catch (error) {
      console.error('Failed to fetch tenant info:', error)
    }
  }

  const login = async (email, password, tenantDomain = null) => {
    setLoading(true)
    try {
      // Use demo login for development
      const result = demoLogin(email, password)
      const jwt = result.token
      
      setToken(jwt)
      const userInfo = parseToken(jwt)
      return userInfo
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData, tenantData = null) => {
    setLoading(true)
    try {
      // Use demo signup for development
      const result = demoSignup(userData, tenantData)
      const jwt = result.token
      
      setToken(jwt)
      const userInfo = parseToken(jwt)
      return userInfo
    } catch (error) {
      console.error('Signup error:', error)
      throw new Error(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setTenant(null)
  }

  const switchTenant = async (tenantId) => {
    if (user?.permissions?.includes('switch_tenant')) {
      await fetchTenantInfo(tenantId)
      // In real app, you might need to refresh the token with new tenant context
    }
  }

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false
  }

  const canAccess = (feature) => {
    if (!tenant?.settings?.features) return false
    const featureValue = tenant.settings.features[feature]
    return featureValue === true || featureValue === -1 // -1 means unlimited
  }

  const getRemainingQuota = (quotaType) => {
    if (!tenant?.settings?.features || !tenant?.usage) return 0
    
    const limit = tenant.settings.features[quotaType]
    const used = tenant.usage[quotaType] || 0
    
    if (limit === -1) return Infinity // Unlimited
    return Math.max(0, limit - used)
  }

  const value = useMemo(() => ({
    // User & Authentication
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    
    // Roles & Permissions
    isSuperAdmin: user?.role === USER_ROLES.SUPER_ADMIN,
    isTenantAdmin: user?.tenantRole === 'admin' || user?.role === USER_ROLES.TENANT_ADMIN,
    isTenantUser: Boolean(user?.tenantId),
    
    // Tenant Information
    tenant,
    tenantPlan: tenant?.plan || 'STARTER',
    tenantFeatures: tenant?.settings?.features || SUBSCRIPTION_PLANS.STARTER.features,
    
    // Methods
    login,
    signup,
    logout,
    switchTenant,
    hasPermission,
    canAccess,
    getRemainingQuota,
    
    // Constants
    SUBSCRIPTION_PLANS,
    USER_ROLES
  }), [token, user, tenant, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
