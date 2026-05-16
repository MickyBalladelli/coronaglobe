import React from 'react';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProgressContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 9000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const Progress = () => {
  return (
    <ProgressContainer>
      <CircularProgress 
        size={80} 
        thickness={4} 
        style={{ color: '#fff', marginBottom: '20px' }} 
        variant="indeterminate"
      />
    </ProgressContainer>
  );
};

export default Progress;
