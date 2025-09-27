import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  LinearProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  PushPin as PinIcon,
  PushPinOutlined as UnpinIcon,
  Folder as FolderIcon,
  Tag as TagIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material'
import { 
  demoNotes, 
  demoCategories, 
  searchNotes 
} from '../data/demoData.js'
import { useAuth } from '../context/AuthContext.jsx'

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, viewMode }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMenuClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getPreviewContent = (content, limit = 120) => {
    const plainText = content.replace(/[#*`\[\]()\n]/g, ' ').trim()
    return plainText.length > limit ? plainText.substring(0, limit) + '...' : plainText
  }

  const formatDate = (date) => {
    return new Intl.RelativeTimeFormat('en').format(
      Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  if (viewMode === 'list') {
    return (
      <Card 
        sx={{ 
          mb: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': { 
            transform: 'translateX(4px)',
            boxShadow: 2
          },
          backgroundColor: note.color + '20' || 'background.paper',
          borderLeft: 4,
          borderLeftColor: note.color || 'primary.main'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onEdit(note)}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {note.isPinned && <PinIcon fontSize="small" color="primary" />}
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {note.title}
                </Typography>
                <Chip label={note.category} size="small" color="primary" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getPreviewContent(note.content)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {note.tags?.slice(0, 3).map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                ))}
                {note.tags?.length > 3 && (
                  <Chip label={`+${note.tags.length - 3} more`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(note.updatedAt)}
              </Typography>
              {(isHovered || anchorEl) && (
                <IconButton size="small" onClick={handleMenuClick}>
                  <MoreIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: note.color + '20' || 'background.paper',
        border: 1,
        borderColor: note.color + '40' || 'divider',
        position: 'relative',
        '&:hover': { 
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: 4,
          borderColor: note.color || 'primary.main'
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      {note.isPinned && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <PinIcon color="primary" fontSize="small" />
        </Box>
      )}
      
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 1, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {note.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {getPreviewContent(note.content, 150)}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {note.tags?.slice(0, 2).map(tag => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.7rem', height: 18 }} 
              />
            ))}
            {note.tags?.length > 2 && (
              <Chip 
                label={`+${note.tags.length - 2}`} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.7rem', height: 18 }} 
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={note.category} 
              size="small" 
              color="primary" 
              variant="filled"
              sx={{ fontSize: '0.7rem' }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(note.updatedAt)}
              </Typography>
              {(isHovered || anchorEl) && (
                <IconButton size="small" onClick={handleMenuClick}>
                  <MoreIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => { onEdit(note); handleMenuClose(); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onTogglePin(note); handleMenuClose(); }}>
          <ListItemIcon>
            {note.isPinned ? <UnpinIcon fontSize="small" /> : <PinIcon fontSize="small" />}
          </ListItemIcon>
          {note.isPinned ? 'Unpin' : 'Pin'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onDelete(note.id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default function Notes() {
  const { user, tenant, tenantFeatures, getRemainingQuota } = useAuth()
  const [notes, setNotes] = useState(demoNotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('updated')
  const [open, setOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Personal', tags: [] })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [showAnalytics, setShowAnalytics] = useState(false)

  const filteredAndSortedNotes = useMemo(() => {
    let result = searchQuery ? searchNotes(searchQuery) : notes
    
    if (selectedCategory !== 'All') {
      result = result.filter(note => note.category === selectedCategory)
    }
    
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'updated':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
    })
    
    return result
  }, [notes, searchQuery, selectedCategory, sortBy])

  const categoryCount = demoCategories.reduce((acc, category) => {
    acc[category] = category === 'All' ? notes.length : notes.filter(note => note.category === category).length
    return acc
  }, {})

  const handleOpen = (note = null) => {
    setEditingNote(note)
    setFormData(note ? {
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags || []
    } : {
      title: '',
      content: '',
      category: 'Personal',
      tags: []
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingNote(null)
    setFormData({ title: '', content: '', category: 'Personal', tags: [] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const now = new Date()
    
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, ...formData, updatedAt: now }
          : note
      ))
    } else {
      const newNote = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        color: '#f5f5f5'
      }
      setNotes(prev => [newNote, ...prev])
    }
    
    handleClose()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id))
    }
  }

  const handleTogglePin = (note) => {
    setNotes(prev => prev.map(n => 
      n.id === note.id ? { ...n, isPinned: !n.isPinned } : n
    ))
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
          <List>
            {demoCategories.map(category => (
              <ListItem
                button
                key={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                <ListItemIcon>
                  <FolderIcon color={selectedCategory === category ? 'inherit' : 'primary'} />
                </ListItemIcon>
                <ListItemText primary={category} />
                <Badge badgeContent={categoryCount[category]} color="primary" />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                sx={{ display: { md: 'none' } }}
                onClick={() => setSidebarOpen(true)}
              >
                <FilterIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                {tenant ? `${tenant.name} Notes` : 'My Notes'}
              </Typography>
              <Chip 
                label={`${filteredAndSortedNotes.length} notes`} 
                color="primary" 
                variant="outlined" 
              />
              {tenant && (
                <Chip 
                  label={`${getRemainingQuota('maxNotes') === Infinity ? '∞' : getRemainingQuota('maxNotes')} remaining`}
                  color={getRemainingQuota('maxNotes') < 10 ? 'error' : 'success'}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {tenantFeatures?.analytics && (
                <Button
                  variant="outlined"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  sx={{ borderRadius: 2 }}
                >
                  Analytics
                </Button>
              )}
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpen()}
                sx={{ borderRadius: 2 }}
                disabled={getRemainingQuota('maxNotes') <= 0 && getRemainingQuota('maxNotes') !== Infinity}
              >
                New Note
              </Button>
            </Box>
          </Box>

          {/* Analytics Panel */}
          {showAnalytics && tenantFeatures?.analytics && (
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                📊 Team Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {tenant?.usage?.notes || 247}
                    </Typography>
                    <Typography variant="caption">Total Notes</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {tenant?.usage?.users || 5}
                    </Typography>
                    <Typography variant="caption">Active Users</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      85%
                    </Typography>
                    <Typography variant="caption">Collaboration Rate</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {tenant?.usage?.storage || '2.5GB'}
                    </Typography>
                    <Typography variant="caption">Storage Used</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Search and Filters */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  {/* Category Filter - Desktop */}
                  <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap' }}>
                    {demoCategories.slice(0, 5).map(category => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category)}
                        color={selectedCategory === category ? 'primary' : 'default'}
                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                  
                  {/* View Controls */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, value) => value && setViewMode(value)}
                      size="small"
                    >
                      <ToggleButton value="grid">
                        <GridViewIcon fontSize="small" />
                      </ToggleButton>
                      <ToggleButton value="list">
                        <ListViewIcon fontSize="small" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                    
                    <TextField
                      select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="updated">Last Updated</MenuItem>
                      <MenuItem value="created">Date Created</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Notes Grid/List */}
          {filteredAndSortedNotes.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h5" gutterBottom color="text.secondary">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery 
                  ? `Try searching for something else or clear the search to see all notes.`
                  : 'Create your first note to get started organizing your thoughts!'
                }
              </Typography>
              {searchQuery ? (
                <Button variant="outlined" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                  Create First Note
                </Button>
              )}
            </Paper>
          ) : (
            <Box>
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {filteredAndSortedNotes.map(note => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={note.id}>
                      <NoteCard 
                        note={note}
                        onEdit={handleOpen}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                        viewMode={viewMode}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box>
                  {filteredAndSortedNotes.map(note => (
                    <NoteCard 
                      key={note.id}
                      note={note}
                      onEdit={handleOpen}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      viewMode={viewMode}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4f46e5 30%, #db2777 90%)',
            transform: 'scale(1.1)'
          }
        }}
        onClick={() => handleOpen()}
      >
        <AddIcon />
      </Fab>

      {/* Note Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                autoFocus
                name="title"
                label="Title"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                sx={{ flex: 2 }}
              />
              <TextField
                select
                name="category"
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{ flex: 1 }}
              >
                {demoCategories.filter(cat => cat !== 'All').map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Box>
            
            <TextField
              name="content"
              label="Content"
              multiline
              rows={12}
              fullWidth
              variant="outlined"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              sx={{ mb: 3 }}
              placeholder="Start writing your note here..."
            />
            
            {/* Tags Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TagIcon fontSize="small" color="action" />
                      </InputAdornment>
                    )
                  }}
                />
                <Button variant="outlined" size="small" onClick={handleAddTag} disabled={!newTag}>
                  Add
                </Button>
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingNote ? 'Update Note' : 'Create Note'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
