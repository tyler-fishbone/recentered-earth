import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2a2a2a',
          color: '#ffffff',
          borderBottom: '1px solid #333',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          About Recentered Earth
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="close"
          size="small"
          sx={{ color: '#ffffff' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#1e1e1e', color: '#ffffff' }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#ffffff' }}>
          Recentered Earth lets you explore how perspective shapes geography by
          shifting the center of the world map. Use the controls below to move,
          zoom, and toggle map layers.
        </Typography>
        <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
          This interactive tool demonstrates how different map projections and
          center points can dramatically change our perception of global
          relationships and distances. Experiment with the latitude and
          longitude controls to see how the world looks from different
          viewpoints.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#1e1e1e', padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
