import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  Divider,
  Alert
} from '@mui/material'
import {
  People as PeopleIcon,
  Notes as NotesIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext.jsx'
import { demoUsers } from '../data/demoData.js'

const MetricCard = ({ icon, title, value, change, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: `${color}.light`,
          color: `${color}.contrastText`,
          mr: 3
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {change && (
          <Typography variant="caption" color={change > 0 ? 'success.main' : 'error.main'}>
            {change > 0 ? '+' : ''}{change}% from last month
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
)

const UserRow = ({ user, onEdit, onDelete }) => (
  <TableRow>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {user.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>
    </TableCell>
    <TableCell>
      <Chip 
        label={user.role.replace('_', ' ').toUpperCase()} 
        size="small" 
        color={user.role === 'tenant_admin' ? 'primary' : 'default'}
        variant="outlined"
      />
    </TableCell>
    <TableCell>
      <Chip 
        label={user.status} 
        size="small" 
        color={user.status === 'active' ? 'success' : 'error'}
      />
    </TableCell>
    <TableCell>
      <Typography variant="caption" color="text.secondary">
        {new Date(user.lastActive).toLocaleDateString()}
      </Typography>
    </TableCell>
    <TableCell>
      <IconButton size="small" onClick={() => onEdit(user)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(user.id)} color="error">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </TableCell>
  </TableRow>
)

export default function TenantAdmin() {
  const { user, tenant, tenantFeatures, getRemainingQuota } = useAuth()
  const [users, setUsers] = useState(demoUsers.filter(u => u.tenantId === user?.tenantId))
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [inviteData, setInviteData] = useState({ email: '', role: 'tenant_user' })

  const handleInviteUser = () => {
    // In real app, this would send an API request
    const newUser = {
      id: `user_${Date.now()}`,
      email: inviteData.email,
      name: inviteData.email.split('@')[0],
      role: inviteData.role,
      tenantId: user.tenantId,
      status: 'pending',
      lastActive: new Date()
    }
    setUsers([...users, newUser])
    setInviteData({ email: '', role: 'tenant_user' })
    setInviteOpen(false)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const metrics = [
    {
      icon: <PeopleIcon />,
      title: 'Team Members',
      value: tenant?.usage?.users || users.length,
      change: 12,
      color: 'primary'
    },
    {
      icon: <NotesIcon />,
      title: 'Total Notes',
      value: tenant?.usage?.notes || 247,
      change: 8,
      color: 'secondary'
    },
    {
      icon: <StorageIcon />,
      title: 'Storage Used',
      value: tenant?.usage?.storage || '2.5GB',
      change: -3,
      color: 'warning'
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Collaboration Rate',
      value: '85%',
      change: 15,
      color: 'success'
    }
  ]

  const remainingUsers = getRemainingQuota('maxUsers')
  const usagePercentage = tenant?.usage?.users / (tenant?.settings?.features?.maxUsers || 1) * 100

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Team Administration
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setInviteOpen(true)}
          disabled={remainingUsers <= 0 && remainingUsers !== Infinity}
        >
          Invite Team Member
        </Button>
      </Box>

      {/* Usage Alert */}
      {remainingUsers < 3 && remainingUsers !== Infinity && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          You're approaching your user limit. {remainingUsers} slots remaining. 
          <Button size="small" sx={{ ml: 2 }}>Upgrade Plan</Button>
        </Alert>
      )}

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Usage Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Plan Usage Overview
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Users</Typography>
                  <Typography variant="body2">
                    {tenant?.usage?.users || users.length} / {tenant?.settings?.features?.maxUsers === -1 ? '∞' : tenant?.settings?.features?.maxUsers}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(usagePercentage, 100)} 
                  color={usagePercentage > 80 ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Notes</Typography>
                  <Typography variant="body2">
                    {tenant?.usage?.notes || 247} / {tenant?.settings?.features?.maxNotes === -1 ? '∞' : tenant?.settings?.features?.maxNotes}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={25} 
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2">
                    {tenant?.usage?.storage || '2.5GB'} / {tenant?.settings?.features?.storage}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={15} 
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Team Members
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={setSelectedUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Invite User Dialog */}
      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inviteData.email}
            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
            sx={{ mb: 3, mt: 1 }}
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={inviteData.role}
            onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
          >
            <MenuItem value="tenant_user">Team Member</MenuItem>
            <MenuItem value="tenant_admin">Team Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleInviteUser} 
            variant="contained"
            disabled={!inviteData.email}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}