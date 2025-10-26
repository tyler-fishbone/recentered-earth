import { useMediaQuery, useTheme } from '@mui/material';

export const useMobileDetection = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // > 900px

  // Detect portrait vs landscape on mobile
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isMobilePortrait: isMobile && isPortrait,
    isMobileLandscape: isMobile && isLandscape,
  };
};
