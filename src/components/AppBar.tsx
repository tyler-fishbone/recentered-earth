import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

interface AppBarProps {
  onInfoClick: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onInfoClick }) => {
  return (
    <MuiAppBar position="static" sx={{ zIndex: 1300 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Recentered Earth
        </Typography>
        <IconButton
          color="inherit"
          onClick={onInfoClick}
          aria-label="About Recentered Earth"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <InfoOutlined />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
};
