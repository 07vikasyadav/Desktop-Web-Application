import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import apiService from '../services/apiServiceRefactored';

const UserRegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Make API call to backend instead of saving to localStorage
      const response = await apiService.users.register(formData);
      
      if (response.success) {
        setSuccess('User registered successfully!');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'customer'
        });

        // Notify parent component of successful registration
        if (onRegistrationSuccess) {
          onRegistrationSuccess(response.data);
        }

        console.log('✅ User registered:', response.data);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
        User Registration
      </Typography>
      
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Create a new user account in the furniture management system
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />

        <TextField
          fullWidth
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />

        <TextField
          fullWidth
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="action" />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            label="Role"
            disabled={loading}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Registering...
            </>
          ) : (
            'Register User'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default UserRegistrationForm;