import React from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';

interface MapControlsAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  showGraticule: boolean;
  onGraticuleChange: (show: boolean) => void;
}

export const MapControlsAccordion: React.FC<MapControlsAccordionProps> = ({
  isOpen,
  onToggle,
  showGraticule,
  onGraticuleChange,
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
      }}
    >
      <Accordion
        expanded={isOpen}
        onChange={onToggle}
        sx={{
          borderRadius: isOpen ? '16px 16px 0 0' : '16px',
          '&:before': { display: 'none' },
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          backgroundColor: '#1e1e1e',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: '#ffffff' }} />}
          sx={{
            minHeight: 48,
            backgroundColor: '#2a2a2a',
            borderRadius: isOpen ? '16px 16px 0 0' : '16px',
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 1,
            },
          }}
        >
          <Settings sx={{ color: '#ffffff' }} />
          <Typography
            variant="subtitle1"
            sx={{ color: '#ffffff', fontWeight: 500 }}
          >
            Map Controls
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#1e1e1e' }}>
          <Stack spacing={3} sx={{ p: 2 }}>
            {/* Graticule Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={showGraticule}
                  onChange={e => onGraticuleChange(e.target.checked)}
                />
              }
              label={
                <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                  Graticule
                </Typography>
              }
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
