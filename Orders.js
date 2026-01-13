import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, MenuItem, Select, 
  FormControl, InputLabel, Collapse, List, ListItem, ListItemText, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAppContext } from '../context/AppContext';

const statusColors = {
  'Pending': 'warning',
  'In Progress': 'info', 
  'Delivered': 'success',
  'Cancelled': 'error'
};

const paymentStatusColors = {
  'Pending': 'error',
  'Partial': 'warning', 
  'Paid': 'success',
  'Completed': 'success'
};

function Orders() {
  const { orders, addOrder, deleteOrder, updateOrder, refreshData, error } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customerName: '', productName: '', quantity: '', total: '', status: 'Pending'
  });

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleAdd = async () => {
    setSubmitError(null);
    console.log('🚀 handleAdd called with:', newOrder);
    console.log('✅ Validation check:', {
      customerName: !!newOrder.customerName,
      productName: !!newOrder.productName, 
      quantity: !!newOrder.quantity,
      total: !!newOrder.total
    });
    
    // Validate required fields
    if (!newOrder.customerName || !newOrder.productName || !newOrder.quantity || !newOrder.total) {
      setSubmitError('Please fill in all required fields');
      console.error('❌ Validation failed - missing required fields');
      return;
    }
    
    // Validate numeric fields
    const quantity = parseInt(newOrder.quantity);
    const total = parseFloat(newOrder.total);
    
    if (isNaN(quantity) || quantity <= 0) {
      setSubmitError('Quantity must be a positive number');
      return;
    }
    
    if (isNaN(total) || total <= 0) {
      setSubmitError('Total amount must be a positive number');
      return;
    }
    
    setLoading(true);
    console.log('✅ Validation passed, submitting order...');
    
    try {
      if (editMode && selectedOrder) {
        console.log('📝 Updating order:', selectedOrder.id);
        await updateOrder(selectedOrder.id, {
          ...newOrder,
          quantity: quantity,
          total: total
        });
      } else {
        console.log('➕ Adding new order');
        const orderToAdd = {
          customerName: newOrder.customerName.trim(),
          productName: newOrder.productName.trim(),
          quantity: quantity,
          total: total,
          status: newOrder.status || 'Pending'
        };
        console.log('📦 Order data to add:', orderToAdd);
        await addOrder(orderToAdd);
      }
      
      // Success - reset form and close dialog
      setNewOrder({ customerName: '', productName: '', quantity: '', total: '', status: 'Pending' });
      setOpen(false);
      setEditMode(false);
      setSelectedOrder(null);
      setSubmitError(null);
      
      // Refresh orders to show real-time updates
      await refreshData();
      console.log('✅ Order saved successfully!');
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save order. Please try again.';
      setSubmitError(errorMessage);
      console.error('❌ Error saving order:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setNewOrder({
      customerName: order?.customer || '',
      productName: order?.product || '',
      quantity: (order?.qty || 0).toString(),
      total: (order?.total || 0).toString(),
      status: order?.status || 'Pending'
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        // Refresh orders to show real-time updates
        await refreshData();
      } catch (error) {
        console.error('Error deleting order:', error);
        // Error is logged and will be shown to user
      }
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedOrder(null);
    setNewOrder({ customerName: '', productName: '', quantity: '', total: '', status: 'Pending' });
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
                <TableCell sx={{ fontWeight: 600 }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payments</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow hover>
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
                      <Chip 
                        label={order.payment_status || 'Pending'}
                        color={paymentStatusColors[order.payment_status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {order.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleOrderExpansion(order.id)}
                          color="primary"
                        >
                          <PaymentIcon fontSize="small" />
                          {expandedOrders.has(order.id) ? 
                            <ExpandLessIcon fontSize="small" /> : 
                            <ExpandMoreIcon fontSize="small" />
                          }
                        </IconButton>
                        <Typography variant="caption">
                          {order.payments?.length || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(order)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(order.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  
                  {/* Collapsible Payments Row */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                      <Collapse in={expandedOrders.has(order.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Linked Payments
                          </Typography>
                          {order.payments && order.payments.length > 0 ? (
                            <List dense>
                              {order.payments.map((payment, index) => (
                                <React.Fragment key={payment.payment_id || index}>
                                  <ListItem>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {payment.payment_id}
                                          </Typography>
                                          <Chip 
                                            label={payment.method}
                                            size="small"
                                            variant="outlined"
                                          />
                                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                                            ₹ {payment.amount.toLocaleString()}
                                          </Typography>
                                          <Chip 
                                            label={payment.status}
                                            color={payment.status === 'Success' ? 'success' : 'error'}
                                            size="small"
                                          />
                                        </Box>
                                      }
                                      secondary={`Paid on: ${payment.paid_on} | Ref: ${payment.transaction_ref}`}
                                    />
                                  </ListItem>
                                  {index < order.payments.length - 1 && <Divider />}
                                </React.Fragment>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                              No payments recorded for this order
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Order Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Order' : 'Create New Order'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product"
                value={newOrder.productName}
                onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
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
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? 'Saving...' : (editMode ? 'Update Order' : 'Create Order')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
