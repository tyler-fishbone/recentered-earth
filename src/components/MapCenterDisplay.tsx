import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { Center } from '../types/map';

interface MapCenterDisplayProps {
  center: Center;
  isAccordionOpen: boolean;
}

export const MapCenterDisplay: React.FC<MapCenterDisplayProps> = ({
  center,
  isAccordionOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobilePortrait = useMediaQuery(
    '(max-width: 600px) and (orientation: portrait)'
  );
  return (
    <Box
      sx={{
        position: 'absolute',
        [isMobilePortrait ? 'top' : 'bottom']: isMobilePortrait
          ? '60px'
          : isAccordionOpen
          ? isMobile
            ? 180
            : 200
          : isMobile
          ? 50
          : 60,
        left: isMobile ? 5 : 10,
        zIndex: 1200,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        padding: isMobile ? '6px 8px' : '8px 12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: isMobilePortrait
          ? 'top 0.3s ease-in-out'
          : 'bottom 0.3s ease-in-out',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#ffffff',
          fontSize: isMobile ? '0.7rem' : '0.8rem',
          fontFamily: 'monospace',
          fontWeight: 500,
        }}
      >
        {isMobile ? 'Center' : 'Map Center'} [Long: {center.lon.toFixed(1)}°,
        Lat: {center.lat.toFixed(1)}°]
      </Typography>
    </Box>
  );
};
