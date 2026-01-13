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

const initialOrders = [
  { id: 'ORD001', customer: 'Amit Sharma', product: 'Wooden Chair', qty: 2, total: 3000, status: 'Delivered', date: '2025-08-02' },
  { id: 'ORD002', customer: 'Rina Kumar', product: 'Office Table', qty: 1, total: 8000, status: 'In Progress', date: '2025-08-11' },
  { id: 'ORD003', customer: 'Sunil Verma', product: 'Custom Wardrobe', qty: 1, total: 25000, status: 'Pending', date: '2025-08-12' },
  { id: 'ORD004', customer: 'Priya Singh', product: 'Dining Set', qty: 1, total: 35000, status: 'Delivered', date: '2025-08-15' },
];

const statusColors = {
  'Pending': 'warning',
  'In Progress': 'info', 
  'Delivered': 'success',
  'Cancelled': 'error'
};

function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [open, setOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '', product: '', qty: '', total: '', status: 'Pending'
  });

  const handleAdd = () => {
    if (newOrder.customer && newOrder.product && newOrder.qty && newOrder.total) {
      setOrders([...orders, {
        id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
        ...newOrder,
        qty: parseInt(newOrder.qty),
        total: parseInt(newOrder.total),
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewOrder({ customer: '', product: '', qty: '', total: '', status: 'Pending' });
      setOpen(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Orders
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage customer orders and order status
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          New Order
        </Button>
      </Box>

      {/* Orders Table */}
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
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
                    <Typography variant="body2" color="textSecondary">
                      {order.product}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.qty}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹ {order.total.toLocaleString()}
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
                    <Typography variant="body2" color="textSecondary">
                      {order.date}
                    </Typography>
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

      {/* Add Order Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product"
                value={newOrder.product}
                onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newOrder.qty}
                onChange={(e) => setNewOrder({...newOrder, qty: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Total Amount (₹)"
                type="number"
                value={newOrder.total}
                onChange={(e) => setNewOrder({...newOrder, total: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newOrder.status}
                  label="Status"
                  onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Create Order</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
