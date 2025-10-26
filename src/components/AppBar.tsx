import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

interface AppBarProps {
  onInfoClick: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onInfoClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MuiAppBar position="static" sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ minHeight: isMobile ? 48 : 64 }}>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: isMobile ? '1rem' : '1.25rem',
          }}
        >
          {isMobile
            ? 'Recentered Earth'
            : 'Mercator Projection From Different Points on Earth'}
        </Typography>
        <IconButton
          color="inherit"
          onClick={onInfoClick}
          aria-label="About Recentered Earth"
          size={isMobile ? 'small' : 'medium'}
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
