import React, { useState } from 'react'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Chip,
  Badge
} from '@mui/material'
import {
  Business as BusinessIcon,
  KeyboardArrowDown as ArrowDownIcon,
  SwapHoriz as SwitchIcon,
  Add as AddIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext.jsx'
import { demoTenants } from '../data/demoData.js'

export default function TenantSwitcher() {
  const { user, tenant, isSuperAdmin, switchTenant } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleTenantSwitch = async (tenantId) => {
    await switchTenant(tenantId)
    handleClose()
  }

  // Only show for super admins or if user has multiple tenant access
  if (!isSuperAdmin && (!user?.permissions?.includes('switch_tenant'))) {
    return null
  }

  const currentTenant = tenant || demoTenants[0]
  const availableTenants = isSuperAdmin ? demoTenants : demoTenants.filter(t => t.id === user.tenantId)

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={
          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
            <BusinessIcon sx={{ fontSize: 14 }} />
          </Avatar>
        }
        endIcon={<ArrowDownIcon />}
        sx={{
          textTransform: 'none',
          color: 'text.primary',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <Box sx={{ textAlign: 'left', ml: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {currentTenant.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentTenant.plan}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 280,
            mt: 1,
            border: 1,
            borderColor: 'divider',
            boxShadow: 3
          }
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Switch Organization
          </Typography>
        </Box>
        
        <Divider />

        {availableTenants.map((tenantOption) => (
          <MenuItem
            key={tenantOption.id}
            onClick={() => handleTenantSwitch(tenantOption.id)}
            selected={tenantOption.id === currentTenant.id}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <BusinessIcon sx={{ fontSize: 16 }} />
              </Avatar>
            </ListItemIcon>
            <ListItemText>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tenantOption.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tenantOption.domain}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip 
                    label={tenantOption.plan} 
                    size="small" 
                    color={tenantOption.plan === 'ENTERPRISE' ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                  <Badge
                    badgeContent={tenantOption.users}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        height: 14,
                        minWidth: 14
                      }
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      users
                    </Typography>
                  </Badge>
                </Box>
              </Box>
            </ListItemText>
          </MenuItem>
        ))}

        {isSuperAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Create Organization" />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Manage Organizations" />
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  )
}