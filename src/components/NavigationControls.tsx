import React from 'react';
import { Box, Stack, Button, useMediaQuery, useTheme } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { ViewState, Center } from '../types/map';

interface NavigationControlsProps {
  viewState: ViewState;
  center: Center;
  onViewStateChange: (viewState: ViewState) => void;
  onCenterChange: (center: Center) => void;
  isAccordionOpen: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  viewState,
  center,
  onViewStateChange,
  onCenterChange,
  isAccordionOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobilePortrait = useMediaQuery(
    '(max-width: 600px) and (orientation: portrait)'
  );
  const handleRotate90 = () => {
    onViewStateChange({
      ...viewState,
      bearing: (viewState.bearing + 90) % 360,
    });
  };

  const handleFlip = () => {
    onViewStateChange({
      ...viewState,
      bearing: (viewState.bearing + 180) % 360,
    });
  };

  const handleLatIncrease = () => {
    onCenterChange({
      ...center,
      lat: Math.min(center.lat + 10, 85),
    });
  };

  const handleLatDecrease = () => {
    onCenterChange({
      ...center,
      lat: Math.max(center.lat - 10, -85),
    });
  };

  const handleLonIncrease = () => {
    onCenterChange({
      ...center,
      lon: ((center.lon + 10 + 540) % 360) - 180,
    });
  };

  const handleLonDecrease = () => {
    onCenterChange({
      ...center,
      lon: ((center.lon - 10 + 540) % 360) - 180,
    });
  };

  const handleReset = () => {
    // Reset everything: center, rotation, and mirror
    onCenterChange({ lon: 0, lat: 0 });
    onViewStateChange({
      ...viewState,
      bearing: 0,
    });
  };

  const buttonSx = {
    backgroundColor: '#1976d2',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  };

  const secondaryButtonSx = {
    backgroundColor: '#9c27b0',
    '&:hover': {
      backgroundColor: '#8e24aa',
    },
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: isAccordionOpen ? (isMobile ? 180 : 200) : isMobile ? 50 : 60,
        right: isMobile ? 5 : 10,
        zIndex: 1200,
        transition: 'bottom 0.3s ease-in-out',
      }}
    >
      <Stack
        spacing={isMobile ? 1 : 2}
        sx={{
          width: isMobilePortrait ? '200px' : isMobile ? '280px' : '350px',
        }}
      >
        {/* 4-Way Navigation Controller */}
        <Stack spacing={isMobile ? 0.5 : 1} alignItems="center">
          {/* Top row - Lat +10° */}
          <Button
            onClick={handleLatIncrease}
            variant="contained"
            size={isMobile ? 'small' : 'small'}
            sx={{
              ...buttonSx,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              minWidth: isMobile ? '60px' : 'auto',
              padding: isMobile ? '4px 8px' : '6px 16px',
            }}
          >
            {isMobile ? 'Lat +10' : 'Lat +10°'}
          </Button>

          {/* Middle row - Lon -10°, Reset, Lon +10° */}
          <Stack
            direction="row"
            spacing={isMobile ? 0.5 : 1}
            alignItems="center"
          >
            <Button
              onClick={handleLonDecrease}
              variant="contained"
              size="small"
              sx={{
                ...buttonSx,
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                minWidth: isMobile ? '60px' : 'auto',
                padding: isMobile ? '4px 8px' : '6px 16px',
              }}
            >
              {isMobile ? 'Lon -10' : 'Lon -10°'}
            </Button>
            <Button
              onClick={handleReset}
              variant="contained"
              size="small"
              sx={{
                ...buttonSx,
                minWidth: isMobile ? '36px' : '48px',
                width: isMobile ? '36px' : '48px',
                height: isMobile ? '36px' : '48px',
                borderRadius: '50%',
              }}
              aria-label="Reset everything"
            >
              <Refresh sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }} />
            </Button>
            <Button
              onClick={handleLonIncrease}
              variant="contained"
              size="small"
              sx={{
                ...buttonSx,
                fontSize: isMobile ? '0.7rem' : '0.875rem',
                minWidth: isMobile ? '60px' : 'auto',
                padding: isMobile ? '4px 8px' : '6px 16px',
              }}
            >
              {isMobile ? 'Lon +10' : 'Lon +10°'}
            </Button>
          </Stack>

          {/* Bottom row - Lat -10° */}
          <Button
            onClick={handleLatDecrease}
            variant="contained"
            size="small"
            sx={{
              ...buttonSx,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              minWidth: isMobile ? '60px' : 'auto',
              padding: isMobile ? '4px 8px' : '6px 16px',
            }}
          >
            {isMobile ? 'Lat -10' : 'Lat -10°'}
          </Button>
        </Stack>

        {/* View Controls - Below navigation */}
        <Stack
          direction="row"
          spacing={isMobile ? 1 : 2}
          justifyContent="center"
          flexWrap="wrap"
        >
          <Button
            onClick={handleFlip}
            variant="contained"
            color="secondary"
            size="small"
            sx={{
              ...secondaryButtonSx,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              minWidth: isMobile ? '50px' : 'auto',
              padding: isMobile ? '4px 8px' : '6px 16px',
            }}
          >
            Flip
          </Button>
          <Button
            onClick={handleRotate90}
            variant="contained"
            color="secondary"
            size="small"
            sx={{
              ...secondaryButtonSx,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              minWidth: isMobile ? '50px' : 'auto',
              padding: isMobile ? '4px 8px' : '6px 16px',
            }}
          >
            {isMobile ? 'Rotate' : 'Rotate 90°'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
