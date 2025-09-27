import React, { useState } from 'react'
import { Box, Button, Container, TextField, Typography, Paper, Card, CardContent, Chip, Divider } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { demoAccounts } from '../utils/demoAuth.js'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const info = await login(email, password)
      toast.success('Logged in successfully')
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
        return
      }
      // Route based on user role
      if (info?.role === 'super_admin') navigate('/admin')
      else if (info?.role === 'tenant_admin' || info?.tenantRole === 'admin') navigate('/tenant-admin')
      else navigate('/notes')
    } catch (err) {
      toast.error(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (account) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Login Form */}
        <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Sign In</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back to NotesApp SaaS
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
            <TextField 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              fullWidth 
              variant="outlined"
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading} 
              size="large"
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>

        {/* Demo Accounts */}
        <Card sx={{ flex: 1, maxWidth: { md: '400px' } }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              🧪 Demo Accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click any account below to auto-fill credentials and test multi-tenant features:
            </Typography>
            
            {demoAccounts.map((account, index) => (
              <Card 
                key={index}
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { 
                    borderColor: 'primary.main',
                    boxShadow: 2
                  }
                }}
                onClick={() => handleDemoLogin(account)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {account.name}
                    </Typography>
                    <Chip 
                      label={account.role} 
                      size="small" 
                      color={account.role === 'Super Admin' ? 'error' : account.role === 'Tenant Admin' ? 'primary' : 'default'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {account.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {account.tenant} • {account.plan}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              All demo accounts use password: <strong>demo123</strong>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
