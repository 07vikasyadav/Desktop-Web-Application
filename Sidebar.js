import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'products', label: 'Products', icon: <InventoryIcon /> },
  { key: 'orders', label: 'Orders', icon: <ShoppingCartIcon /> },
  { key: 'payments', label: 'Payments', icon: <PaymentIcon /> },
  { key: 'customOrders', label: 'Custom Orders', icon: <BuildIcon /> },
  { key: 'users', label: 'Users', icon: <PeopleIcon /> },
];

function Sidebar({ onNavigate, selected }) {
  return (
    <Drawer 
      variant="permanent" 
      sx={{ 
        width: 250, 
        flexShrink: 0, 
        '& .MuiDrawer-paper': { 
          width: 250, 
          boxSizing: 'border-box',
          bgcolor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        } 
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: '#1976d2', mr: 1, width: 32, height: 32 }}>IF</Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
              Inaam Furniture
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Admin Panel
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ p: 1 }}>
        {navItems.map(item => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton 
              selected={selected === item.key} 
              onClick={() => onNavigate(item.key)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#e3f2fd',
                  '& .MuiListItemIcon-root': {
                    color: '#1976d2',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#1976d2',
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
