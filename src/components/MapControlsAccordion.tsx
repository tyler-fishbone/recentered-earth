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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ExpandMore, Settings } from '@mui/icons-material';

interface MapControlsAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  showGraticule: boolean;
  onGraticuleChange: (show: boolean) => void;
  showGlobe: boolean;
  onGlobeChange: (show: boolean) => void;
}

export const MapControlsAccordion: React.FC<MapControlsAccordionProps> = ({
  isOpen,
  onToggle,
  showGraticule,
  onGraticuleChange,
  showGlobe,
  onGlobeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            minHeight: isMobile ? 44 : 48,
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
            variant={isMobile ? 'body1' : 'subtitle1'}
            sx={{
              color: '#ffffff',
              fontWeight: 500,
              fontSize: isMobile ? '0.9rem' : '1rem',
            }}
          >
            Map Controls
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#1e1e1e' }}>
          <Stack spacing={isMobile ? 2 : 3} sx={{ p: isMobile ? 1.5 : 2 }}>
            {/* Graticule Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={showGraticule}
                  onChange={e => onGraticuleChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      width: isMobile ? 20 : 20,
                      height: isMobile ? 20 : 20,
                    },
                    '& .MuiSwitch-track': {
                      height: isMobile ? 12 : 14,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                  }}
                >
                  Graticule - Morphed Original
                </Typography>
              }
            />

            {/* Mini Globe Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={showGlobe}
                  onChange={e => onGlobeChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      width: isMobile ? 20 : 20,
                      height: isMobile ? 20 : 20,
                    },
                    '& .MuiSwitch-track': {
                      height: isMobile ? 12 : 14,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    color: '#ffffff',
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                  }}
                >
                  Mini Globe
                </Typography>
              }
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
