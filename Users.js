import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Person, Email, Phone } from '@mui/icons-material';
import UserRegistrationForm from '../components/UserRegistrationForm';
import apiServiceRefactored from '../services/apiServiceRefactored';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Load users from MySQL database
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Loading users from MySQL...');
      const response = await apiServiceRefactored.users.getAll();
      const parsed = response?.data ?? response;
      // apiServiceRefactored returns arrays often; normalize to array
      const usersArr = Array.isArray(parsed) ? parsed : (parsed?.data || parsed?.users || []);
      setUsers(usersArr || []);
      console.log('✅ Users loaded from MySQL:', usersArr.length, 'users');
    } catch (error) {
      console.error('❌ Error loading users from MySQL:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRegistrationSuccess = (newUser) => {
    // Refresh the users list after successful registration
    loadUsers();
    setShowRegistrationForm(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'customer':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage system users - all data is stored in MySQL database
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Add User Button */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Registered Users ({users.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowRegistrationForm(true)}
              >
                Add New User
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Users List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
                <Button onClick={loadUsers} sx={{ ml: 2 }}>
                  Retry
                </Button>
              </Alert>
            ) : users.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No users found. Click "Add New User" to register the first user.
              </Typography>
            ) : (
              <List>
                {users.map((user) => (
                  <ListItem key={user.user_id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Person color="action" />
                          <Typography variant="h6">{user.name}</Typography>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone fontSize="small" color="action" />
                            <Typography variant="body2">{user.phone || 'N/A'}</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.user_id} | Registered: {formatDate(user.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Registration Form Dialog */}
      <Dialog
        open={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Register New User
        </DialogTitle>
        <DialogContent>
          <UserRegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRegistrationForm(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;