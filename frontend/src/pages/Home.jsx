import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Fab,
  LinearProgress,
  Avatar,
  Stack,
  Tooltip
} from '@mui/material'
import {
  Create,
  Search,
  Cloud,
  Security,
  Speed,
  Devices,
  TrendingUp,
  Star,
  PlayArrow,
  KeyboardArrowDown
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const PricingCard = ({ plan, price, interval, features, isPopular, onSelect }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        border: isPopular ? 2 : 1,
        borderColor: isPopular ? 'primary.main' : 'divider',
        transform: isPopular ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: isPopular ? 'scale(1.08)' : 'scale(1.03)',
          boxShadow: 6 
        }
      }}
    >
      {isPopular && (
        <Chip
          label="Most Popular"
          color="primary"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      )}
      
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {plan}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            ${price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            per {interval}
          </Typography>
        </Box>
        
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>What's included:</Typography>
          {Object.entries(features).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {typeof value === 'boolean' ? (value ? '✓' : '✗') : value === -1 ? 'Unlimited' : value}
              </Typography>
            </Box>
          ))}
        </Stack>
        
        <Button 
          variant={isPopular ? 'contained' : 'outlined'}
          size="large"
          fullWidth
          onClick={() => onSelect(plan)}
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          {price === 0 ? 'Start Free' : 'Start Trial'}
        </Button>
      </CardContent>
    </Card>
  )
}

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'white',
            mb: 2,
            transition: 'all 0.3s ease'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

const StatCard = ({ value, label, color = 'primary' }) => {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/[^0-9]/g, ''))

  useEffect(() => {
    const duration = 2000
    const step = target / (duration / 50)
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= target) {
          clearInterval(timer)
          return target
        }
        return Math.min(prev + step, target)
      })
    }, 50)
    return () => clearInterval(timer)
  }, [target])

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700, 
          color: `${color}.main`,
          background: `linear-gradient(45deg, var(--mui-palette-${color}-main), var(--mui-palette-${color}-light))`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        {Math.floor(count).toLocaleString()}{value.includes('+') ? '+' : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  )
}

export default function Home() {
  const { isAuthenticated, user, tenant, SUBSCRIPTION_PLANS, signup } = useAuth()
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('PROFESSIONAL')

  useEffect(() => {
    setHeroVisible(true)
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (tenant) {
        navigate('/notes')
      } else {
        navigate('/onboarding')
      }
    } else {
      navigate('/login')
    }
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    // In a real app, this would start the signup/checkout process
    if (isAuthenticated) {
      // Upgrade existing tenant
      navigate('/billing')
    } else {
      // Start signup flow
      navigate(`/signup?plan=${plan.toLowerCase()}`)
    }
  }

  const features = [
    {
      icon: <Create fontSize="large" />,
      title: 'Team Collaboration',
      description: 'Real-time collaborative editing with your team. Share notes, assign tasks, and work together seamlessly.'
    },
    {
      icon: <Search fontSize="large" />,
      title: 'Enterprise Search',
      description: 'AI-powered search across your entire organization\'s knowledge base with advanced filtering and insights.'
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption, SSO integration, and granular access controls.'
    },
    {
      icon: <Devices fontSize="large" />,
      title: 'Multi-Tenant Architecture',
      description: 'Complete data isolation for each organization with custom branding and white-label options.'
    },
    {
      icon: <Speed fontSize="large" />,
      title: 'Analytics & Insights',
      description: 'Track team productivity, content engagement, and knowledge sharing with detailed analytics.'
    },
    {
      icon: <Cloud fontSize="large" />,
      title: 'API & Integrations',
      description: 'Connect with your existing tools through our REST API and pre-built integrations.'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: heroVisible ? 1 : 0
          }}
        >
          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            Enterprise Knowledge
            <br />
            Management Platform
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 700, mx: 'auto', fontWeight: 400 }}
          >
            Empower your team with secure, collaborative note-taking. 
            Multi-tenant architecture built for organizations of all sizes.
          </Typography>

          {isAuthenticated && (
            <Card 
              sx={{ 
                mb: 4, 
                p: 2, 
                bgcolor: 'success.light', 
                borderRadius: 3,
                maxWidth: 500,
                mx: 'auto',
                border: 1,
                borderColor: 'success.main'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.dark' }}>
                    Welcome back, {user?.email}!
                  </Typography>
                  <Chip 
                    label={user?.role || 'Member'} 
                    size="small" 
                    color="success"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>
              </Box>
            </Card>
          )}
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleGetStarted}
              startIcon={isAuthenticated ? <TrendingUp /> : <PlayArrow />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
            </Button>
            
            {!isAuthenticated && (
              <Button 
                component={Link} 
                to="/login" 
                variant="outlined" 
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Stack>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard value="2,500+" label="Organizations" color="primary" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard value="50,000+" label="Team Members" color="secondary" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard value="5M+" label="Notes Created" color="success" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard value="99.9%" label="Uptime SLA" color="warning" />
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Typography 
          variant="h3" 
          textAlign="center" 
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Why Choose NotesApp?
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6, fontWeight: 400 }}
        >
          Everything you need to capture, organize, and access your ideas
        </Typography>

        <Grid container spacing={4} sx={{ mb: 12 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <FeatureCard 
                {...feature} 
                delay={index * 200}
              />
            </Grid>
          ))}
        </Grid>

        {/* Pricing Section */}
        <Typography 
          variant="h3" 
          textAlign="center" 
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Simple, Transparent Pricing
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary" 
          sx={{ mb: 6, fontWeight: 400 }}
        >
          Choose the plan that fits your organization's needs. Start free, upgrade anytime.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <Grid size={{ xs: 12, md: 4 }} key={key}>
              <PricingCard 
                plan={plan.name}
                price={plan.price}
                interval={plan.interval}
                features={plan.features}
                isPopular={key === 'PROFESSIONAL'}
                onSelect={() => handlePlanSelect(key)}
              />
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Card 
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            color: 'white',
            textAlign: 'center',
            p: 6,
            borderRadius: 4
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to Transform Your Team's Knowledge Management?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join 2,500+ organizations already using NotesApp SaaS to collaborate better
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
          </Button>
        </Card>
      </Container>

      {/* Floating Action Button */}
      <Tooltip title="Scroll to top">
        <Fab 
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)'
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <KeyboardArrowDown sx={{ transform: 'rotate(180deg)' }} />
        </Fab>
      </Tooltip>
    </Box>
  )
}
