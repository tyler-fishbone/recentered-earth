import React from 'react';
import { Box, Stack, Button } from '@mui/material';
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
  const handleRotate90 = () => {
    onViewStateChange({
      ...viewState,
      bearing: (viewState.bearing + 90) % 360,
    });
  };

  const handleMirror = () => {
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
    onCenterChange({ lon: 0, lat: 0 });
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
        bottom: isAccordionOpen ? 200 : 60,
        right: 10,
        zIndex: 1200,
        transition: 'bottom 0.3s ease-in-out',
      }}
    >
      <Stack spacing={2} sx={{ width: '350px' }}>
        {/* View Controls */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          <Button
            onClick={handleRotate90}
            variant="contained"
            color="secondary"
            size="small"
            sx={secondaryButtonSx}
          >
            Rotate 90°
          </Button>
          <Button
            onClick={handleMirror}
            variant="contained"
            color="secondary"
            size="small"
            sx={secondaryButtonSx}
          >
            Mirror
          </Button>
        </Stack>

        {/* Data Rotation Controls */}
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            flexWrap="wrap"
          >
            <Button
              onClick={handleLatIncrease}
              variant="contained"
              size="small"
              sx={buttonSx}
            >
              Lat +10°
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            flexWrap="wrap"
          >
            <Button
              onClick={handleLonDecrease}
              variant="contained"
              size="small"
              sx={buttonSx}
            >
              Lon -10°
            </Button>
            <Button
              onClick={handleReset}
              variant="contained"
              size="small"
              sx={buttonSx}
            >
              Reset
            </Button>
            <Button
              onClick={handleLonIncrease}
              variant="contained"
              size="small"
              sx={buttonSx}
            >
              Lon +10°
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            flexWrap="wrap"
          >
            <Button
              onClick={handleLatDecrease}
              variant="contained"
              size="small"
              sx={buttonSx}
            >
              Lat -10°
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
