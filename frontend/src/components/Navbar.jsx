import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  Chip
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  Person,
  Settings,
  Logout,
  AdminPanelSettings,
  Notes as NotesIcon,
  Home as HomeIcon,
  Notifications
} from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import TenantSwitcher from './TenantSwitcher.jsx'

export default function Navbar() {
  const { isAuthenticated, user, tenant, logout, isTenantAdmin, isSuperAdmin } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  // Hide navbar on login page
  if (location.pathname === '/login') return null

  const handleLogout = () => {
    logout()
    navigate('/login')
    setAnchorEl(null)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getInitials = (email) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  const isCurrentPath = (path) => location.pathname === path

  const navButtons = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    ...(isAuthenticated ? [
      { path: '/notes', label: 'Notes', icon: <NotesIcon /> },
      ...(isTenantAdmin ? [
        { path: '/tenant-admin', label: 'Team Admin', icon: <AdminPanelSettings /> }
      ] : []),
      ...(isSuperAdmin ? [
        { path: '/admin', label: 'Super Admin', icon: <AdminPanelSettings /> }
      ] : [])
    ] : [])
  ]

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        background: darkMode 
          ? 'rgba(30,41,59,0.8)' 
          : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'primary.main',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #6366f1, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📝 NotesApp SaaS
          </Typography>
          {tenant && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <Typography variant="body2" color="text.secondary">for</Typography>
              <TenantSwitcher />
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Navigation Buttons */}
          {navButtons.map(({ path, label, icon }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              startIcon={icon}
              variant={isCurrentPath(path) ? 'contained' : 'text'}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 'auto',
                px: 2,
                color: isCurrentPath(path) ? 'white' : 'text.primary'
              }}
            >
              {label}
            </Button>
          ))}

          {/* Theme Toggle */}
          <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleTheme} sx={{ ml: 1 }}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <Tooltip title="Notifications">
                <IconButton>
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {getInitials(user?.email)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user?.email}
                  </Typography>
                  <Chip 
                    label={user?.role || 'Member'} 
                    size="small" 
                    color={user?.role?.toLowerCase() === 'admin' ? 'secondary' : 'primary'}
                    sx={{ mt: 0.5, fontSize: '0.75rem' }}
                  />
                </Box>
                
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={() => navigate('/settings')}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              component={Link} 
              to="/login"
              variant="contained"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
