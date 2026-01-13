import React, { useState, useContext } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  AdminPanelSettings
} from '@mui/icons-material';
import { AppContext } from '../context/AppContext';

const AdminLogin = ({ onLoginSuccess }) => {
  const { login, loading, error } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      setValidationError('Username is required');
      return;
    }
    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }

    try {
      // Clean credentials for MySQL authentication
      const cleanUsername = formData.username.trim();
      const cleanPassword = formData.password.trim();
      
      console.log('🔍 Frontend sending MySQL credentials:', { 
        username: `"${cleanUsername}"`, 
        password: `"${cleanPassword}"`
      });
      
      const result = await login(cleanUsername, cleanPassword);
      if (result.success) {
        console.log('✅ MySQL login successful:', result.user);
        onLoginSuccess(result);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Show more helpful error message
      if (error.message && error.message.includes('credentials')) {
        setValidationError('Invalid credentials. Please check username and password (no extra spaces).');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
              padding: 3,
              textAlign: 'center'
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Admin Login
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Inaam Furniture Management System
            </Typography>
          </Box>

          <CardContent sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {(error || validationError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {validationError || error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  height: 50,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Backend must be running at http://127.0.0.1:5000
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;