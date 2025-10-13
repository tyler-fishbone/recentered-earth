import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Center } from '../types/map';

interface MapCenterDisplayProps {
  center: Center;
  isAccordionOpen: boolean;
}

export const MapCenterDisplay: React.FC<MapCenterDisplayProps> = ({
  center,
  isAccordionOpen,
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: isAccordionOpen ? 200 : 60,
        left: 10,
        zIndex: 1200,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        padding: '8px 12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'bottom 0.3s ease-in-out',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#ffffff',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          fontWeight: 500,
        }}
      >
        Map Center [Long: {center.lon.toFixed(1)}°, Lat: {center.lat.toFixed(1)}
        °]
      </Typography>
    </Box>
  );
};
