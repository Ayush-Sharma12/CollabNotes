import React, { useState } from 'react'
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Button
} from '@mui/material'
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Notes as NotesIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext.jsx'
import { demoTenants } from '../data/demoData.js'

const MetricCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
  <Card>
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
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
)

export default function Admin() {
  const { switchTenant } = useAuth()
  
  const totalUsers = demoTenants.reduce((sum, tenant) => sum + tenant.users, 0)
  const totalNotes = demoTenants.reduce((sum, tenant) => sum + tenant.notes, 0)
  const totalRevenue = demoTenants.reduce((sum, tenant) => sum + tenant.billing.amount, 0)

  const handleViewTenant = async (tenantId) => {
    await switchTenant(tenantId)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Super Admin Dashboard
      </Typography>

      {/* Platform Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<BusinessIcon />}
            title="Active Organizations"
            value={demoTenants.length}
            subtitle="Multi-tenant instances"
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<PeopleIcon />}
            title="Total Users"
            value={totalUsers.toLocaleString()}
            subtitle="Across all tenants"
            color="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<NotesIcon />}
            title="Total Notes"
            value={totalNotes.toLocaleString()}
            subtitle="Platform-wide content"
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<TrendingUpIcon />}
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Recurring revenue"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Tenant Management Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Organization Management
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {demoTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.domain}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.plan}
                        size="small"
                        color={tenant.plan === 'ENTERPRISE' ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {tenant.users} / {tenant.maxUsers === -1 ? '∞' : tenant.maxUsers}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={tenant.maxUsers === -1 ? 30 : (tenant.users / tenant.maxUsers) * 100}
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {tenant.notes.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${tenant.billing.amount}/mo
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.status}
                        size="small"
                        color={tenant.status === 'active' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewTenant(tenant.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}
