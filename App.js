import React, { useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ConnectionStatus from './components/ConnectionStatus';
import AdminLogin from './components/AdminLogin';
import Dashboard from './screens/Dashboard';
import Products from './screens/Products';
import Orders from './screens/Orders';
import Payments from './screens/Payments';
import CustomOrders from './screens/CustomOrders';
import Users from './screens/Users';
import Login from './screens/Login';
import { Box, Tooltip, IconButton } from '@mui/material';
import { Logout, ManageAccounts } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f6fa',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const screens = {
  dashboard: <Dashboard />,
  products: <Products />,
  orders: <Orders />,
  payments: <Payments />,
  customOrders: <CustomOrders />,
  users: <Users />,
  login: <Login />,
};

// Main App Component with Authentication
const AppContent = () => {
  const { isAuthenticated, currentAdmin, logout } = useContext(AppContext);
  const [screen, setScreen] = useState('dashboard');

  const handleLoginSuccess = (loginResult) => {
    console.log('Login successful:', loginResult);
    // Login state is managed by context
  };

  const handleLogout = () => {
    logout();
    setScreen('dashboard'); // Reset to dashboard after logout
  };

  const forceShowLogin = () => {
    try {
      // Set the force-login flag and clear persisted auth so the app starts at Login
      localStorage.setItem('inaam_force_login', 'true');
      localStorage.removeItem('inaam_auth');
      // Reload to let AppContext re-check auth state
      window.location.reload();
    } catch (e) {
      console.error('Failed to force show login:', e);
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main application if authenticated
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Sidebar onNavigate={setScreen} selected={screen} />
      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Welcome, <strong>{currentAdmin?.username}</strong></span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConnectionStatus />
            <Tooltip title="Show Login (force)">
              <IconButton onClick={forceShowLogin} color="primary">
                <ManageAccounts />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="primary">
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {screens[screen]}
      </Box>
    </Box>
  );
};

function App() {
  // Use AppContent which already handles authentication
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
