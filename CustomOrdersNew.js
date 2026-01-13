import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const initialCustomOrders = [
  { 
    id: 'CUSTORD001', 
    customer: 'Rajesh Kumar', 
    productName: 'Custom L-shaped Sofa', 
    material: 'Premium Leather', 
    dimensions: '8ft x 6ft x 3ft', 
    estimatedCost: 45000, 
    status: 'In Progress',
    date: '2025-08-10'
  },
  { 
    id: 'CUSTORD002', 
    customer: 'Meera Patel', 
    productName: 'Modular Kitchen Cabinets', 
    material: 'Plywood with Laminate', 
    dimensions: '12ft x 8ft x 2ft', 
    estimatedCost: 85000, 
    status: 'Design Phase',
    date: '2025-08-14'
  },
  { 
    id: 'CUSTORD003', 
    customer: 'Arjun Singh', 
    productName: 'Study Table with Storage', 
    material: 'Solid Wood', 
    dimensions: '4ft x 2ft x 3ft', 
    estimatedCost: 12000, 
    status: 'Completed',
    date: '2025-08-08'
  },
];

const statusColors = {
  'Design Phase': 'info',
  'In Progress': 'warning',
  'Completed': 'success',
  'On Hold': 'error'
};

function CustomOrders() {
  const [customOrders, setCustomOrders] = useState(initialCustomOrders);
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '', productName: '', material: '', dimensions: '', estimatedCost: '', status: 'Design Phase'
  });

  const handleAdd = () => {
    if (newOrder.customer && newOrder.productName && newOrder.estimatedCost) {
      setCustomOrders([...customOrders, {
        id: `CUSTORD${String(customOrders.length + 1).padStart(3, '0')}`,
        ...newOrder,
        estimatedCost: parseInt(newOrder.estimatedCost),
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewOrder({ customer: '', productName: '', material: '', dimensions: '', estimatedCost: '', status: 'Design Phase' });
      setOpen(false);
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
              {customOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {order.material}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {order.dimensions}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹ {order.estimatedCost.toLocaleString()}
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
              ))}
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Create Custom Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomOrders;
