import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import UserForm from './UserForm';
import { userApi } from '../../services/mockApi';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setLoading(true);
      await userApi.deleteUser(userId);
      await loadUsers();
      setError(null);
    } catch (err) {
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userData) => {
    try {
      setLoading(true);
      if (selectedUser) {
        await userApi.updateUser(selectedUser.id, userData);
      } else {
        await userApi.createUser(userData);
      }
      await loadUsers();
      setOpenForm(false);
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      setError('Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMobileView = () => (
    <Grid container spacing={2}>
      {filteredUsers.map((user) => (
        <Grid item xs={12} key={user.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="textSecondary" gutterBottom>{user.email}</Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Chip label={user.role} color="primary" variant="outlined" size="small" />
                <Chip
                  label={user.status}
                  color={user.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderDesktopView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={user.role} color="primary" variant="outlined" size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={user.status}
                  color={user.status === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleEdit(user)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(user.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">User Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(null);
              setOpenForm(true);
            }}
            disabled={loading}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography color="textSecondary">
            {searchQuery ? 'No users found matching your search.' : 'No users available.'}
          </Typography>
        </Box>
      ) : (
        isMobile ? renderMobileView() : renderDesktopView()
      )}

      <UserForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        user={selectedUser}
      />
    </Box>
  );
};

export default UserList;
