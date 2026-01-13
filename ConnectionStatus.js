import React from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import { CheckCircle, CloudOff, Refresh, Wifi } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

const ConnectionStatus = () => {
  const { loading, refreshData } = useAppContext();

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={<CheckCircle />}
        label={'Online - Live Data'}
        color={'success'}
        size="small"
        variant={'filled'}
      />
      <IconButton 
        onClick={handleRefresh} 
        disabled={loading}
        size="small"
        title={"Refresh from Backend"}
      >
        <Refresh />
      </IconButton>
    </Box>
  );
};

export default ConnectionStatus;
