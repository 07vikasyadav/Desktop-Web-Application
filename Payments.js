import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useAppContext } from '../context/AppContext';

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque'];
const statusColors = {
  'Completed': 'success',
  'Pending': 'warning',
  'Failed': 'error'
};

function Payments() {
  const { payments, addPayment, refreshOrders, error } = useAppContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newPayment, setNewPayment] = useState({
    orderId: '', amount: '', method: 'Cash', status: 'Completed'
  });

  const handleAdd = async () => {
    setSubmitError(null);
    console.log('🚀 Payment handleAdd called with:', newPayment);
    
    if (!newPayment.orderId || !newPayment.amount) {
      setSubmitError('Please fill in Order ID and Amount');
      return;
    }
    
    const amount = parseFloat(newPayment.amount);
    if (isNaN(amount) || amount <= 0) {
      setSubmitError('Amount must be a positive number');
      return;
    }
    
    setLoading(true);
    console.log('✅ Validation passed, submitting payment...');
    
    try {
      await addPayment({
        orderId: newPayment.orderId.trim(),
        amount: amount,
        method: newPayment.method || 'Cash',
        status: newPayment.status || 'Completed'
      });
      setNewPayment({ orderId: '', amount: '', method: 'Cash', status: 'Completed' });
      setOpen(false);
      setSubmitError(null);
      await refreshOrders();
      console.log('✅ Payment saved successfully!');
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save payment. Please try again.';
      setSubmitError(errorMessage);
      console.error('❌ Error adding payment:', error);
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
            Payments
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track payment records and transactions
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Payment
        </Button>
      </Box>

      {/* Payments Table */}
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Payment ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary">
                      {payment.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹ {payment.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.method}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {payment.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.status}
                      color={statusColors[payment.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <ReceiptIcon fontSize="small" />
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

      {/* Add Payment Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Order ID"
                value={newPayment.orderId}
                onChange={(e) => setNewPayment({...newPayment, orderId: e.target.value})}
                placeholder="e.g., ORD001"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={newPayment.method}
                  label="Payment Method"
                  onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPayment.status}
                  label="Status"
                  onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
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
            {loading ? 'Saving...' : 'Add Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payments;
