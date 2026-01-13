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

const initialPayments = [
  { id: 'PAY001', orderId: 'ORD001', amount: 3000, method: 'Cash', date: '2025-08-02', status: 'Completed' },
  { id: 'PAY002', orderId: 'ORD002', amount: 8000, method: 'Card', date: '2025-08-11', status: 'Pending' },
  { id: 'PAY003', orderId: 'ORD003', amount: 25000, method: 'Bank Transfer', date: '2025-08-12', status: 'Completed' },
  { id: 'PAY004', orderId: 'ORD004', amount: 35000, method: 'UPI', date: '2025-08-15', status: 'Completed' },
];

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque'];
const statusColors = {
  'Completed': 'success',
  'Pending': 'warning',
  'Failed': 'error'
};

function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [open, setOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    orderId: '', amount: '', method: 'Cash', status: 'Completed'
  });

  const handleAdd = () => {
    if (newPayment.orderId && newPayment.amount) {
      setPayments([...payments, {
        id: `PAY${String(payments.length + 1).padStart(3, '0')}`,
        ...newPayment,
        amount: parseInt(newPayment.amount),
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewPayment({ orderId: '', amount: '', method: 'Cash', status: 'Completed' });
      setOpen(false);
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Add Payment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payments;
