import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const BackendErrorModal = ({ open, onClose, onRetry }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          <Typography variant="h6">Backend Not Reachable</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The backend server is not available. Please ensure the backend is running.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Backend URL:</strong> http://127.0.0.1:5000
        </Typography>
        <Typography variant="body2" color="text.secondary">
          To start the backend server, run:
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}
        >
          cd backend<br />
          node server.js
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onRetry && (
          <Button onClick={onRetry} variant="contained" color="primary">
            Retry Connection
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BackendErrorModal;

