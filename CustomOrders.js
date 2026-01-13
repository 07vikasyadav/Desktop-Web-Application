import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppContext } from '../context/AppContext';

const statusColors = {
  'Design Phase': 'info',
  'In Progress': 'warning',
  'Completed': 'success',
  'On Hold': 'error'
};

function CustomOrders() {
  const { customOrders, addCustomOrder, error } = useAppContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customer: '', productName: '', material: '', dimensions: '', estimatedCost: '', status: 'Design Phase'
  });

  const handleAdd = async () => {
    setSubmitError(null);
    console.log('🚀 Custom Order handleAdd called with:', newOrder);
    
    if (!newOrder.customer || !newOrder.productName || !newOrder.estimatedCost) {
      setSubmitError('Please fill in Customer, Product Name, and Estimated Cost');
      return;
    }
    
    const estimatedCost = parseFloat(newOrder.estimatedCost);
    if (isNaN(estimatedCost) || estimatedCost <= 0) {
      setSubmitError('Estimated Cost must be a positive number');
      return;
    }
    
    setLoading(true);
    console.log('✅ Validation passed, submitting custom order...');
    
    try {
      await addCustomOrder({
        customerName: newOrder.customer.trim(),
        productName: newOrder.productName.trim(),
        materials: newOrder.material || '',
        dimensions: newOrder.dimensions || '',
        estimatedCost: estimatedCost,
        status: newOrder.status || 'Design Phase'
      });
      setNewOrder({ customer: '', productName: '', material: '', dimensions: '', estimatedCost: '', status: 'Design Phase' });
      setOpen(false);
      setSubmitError(null);
      console.log('✅ Custom order saved successfully!');
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save custom order. Please try again.';
      setSubmitError(errorMessage);
      console.error('❌ Error adding custom order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Custom Orders
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage custom furniture requests and specifications
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          New Custom Order
        </Button>
      </Box>

      {/* Custom Orders Table */}
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dimensions</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Est. Cost</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customOrders && customOrders.length > 0 ? customOrders.map((order) => (
                <TableRow key={order.id || order.custom_order_id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.id || order.custom_order_id || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.customer || order.user?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.productName || order.product_name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {order.material || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {order.dimensions || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹ {(order.estimatedCost || 0).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No custom orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Custom Order Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Custom Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={newOrder.productName}
                onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Material"
                value={newOrder.material}
                onChange={(e) => setNewOrder({...newOrder, material: e.target.value})}
                placeholder="e.g., Solid Wood, Plywood, etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dimensions"
                value={newOrder.dimensions}
                onChange={(e) => setNewOrder({...newOrder, dimensions: e.target.value})}
                placeholder="e.g., 6ft x 4ft x 3ft"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimated Cost (₹)"
                type="number"
                value={newOrder.estimatedCost}
                onChange={(e) => setNewOrder({...newOrder, estimatedCost: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newOrder.status}
                  label="Status"
                  onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                >
                  <MenuItem value="Design Phase">Design Phase</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        {submitError && (
          <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, mx: 2, mb: 1 }}>
            <Typography variant="body2" color="error">
              ❌ {submitError}
            </Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, mx: 2, mb: 1 }}>
            <Typography variant="body2" color="error">
              ❌ {error}
            </Typography>
          </Box>
        )}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={loading}>
            {loading ? 'Saving...' : 'Create Custom Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomOrders;
