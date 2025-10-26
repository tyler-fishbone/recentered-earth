import { useState, useEffect } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';
import { useMapData } from './hooks/useMapData';
import { useMapLayers } from './hooks/useMapLayers';
import { useMobileDetection } from './hooks/useMobileDetection';
import {
  AppBar,
  GlobeView,
  NavigationControls,
  MapControlsAccordion,
  InfoDialog,
  Map,
  MapCenterDisplay,
} from './components';
import type { ViewState, Center } from './types/map';

export default function App() {
  // Load map data
  const { data, graticuleData } = useMapData();

  // Mobile detection
  const { isMobilePortrait } = useMobileDetection();

  // rotation center — this is the "new 0,0" for projection
  const [center, setCenter] = useState<Center>({
    lon: 0,
    lat: 0,
  });

  // toggle for graticule visibility
  const [showGraticule, setShowGraticule] = useState(false);

  // toggle for mini globe visibility - hide by default on mobile portrait
  const [showGlobe, setShowGlobe] = useState(!isMobilePortrait);

  // UI state
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [controlsAccordionOpen, setControlsAccordionOpen] = useState(false);

  const [viewState, setViewState] = useState<ViewState>({
    longitude: 0,
    latitude: 0,
    zoom: 0.5,
    bearing: 0,
  });

  // Update globe visibility when orientation changes
  useEffect(() => {
    if (isMobilePortrait) {
      setShowGlobe(false);
    } else {
      setShowGlobe(true);
    }
  }, [isMobilePortrait]);

  // Generate map layers
  const { layers } = useMapLayers({
    data,
    graticuleData,
    center,
    showGraticule,
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#121212',
        }}
      >
        {/* Top App Bar */}
        <AppBar onInfoClick={() => setInfoDialogOpen(true)} />

        {/* Main Content Area */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Map
            viewState={viewState}
            onViewStateChange={setViewState}
            layers={layers}
          />

          {/* Map Center Display - Bottom Left */}
          <MapCenterDisplay
            center={center}
            isAccordionOpen={controlsAccordionOpen}
          />

          {/* Navigation Controls - Above Accordion */}
          <NavigationControls
            viewState={viewState}
            center={center}
            onViewStateChange={setViewState}
            onCenterChange={setCenter}
            isAccordionOpen={controlsAccordionOpen}
          />

          {/* Map Controls Accordion - Bottom */}
          <MapControlsAccordion
            isOpen={controlsAccordionOpen}
            onToggle={() => setControlsAccordionOpen(!controlsAccordionOpen)}
            showGraticule={showGraticule}
            onGraticuleChange={setShowGraticule}
            showGlobe={showGlobe}
            onGlobeChange={setShowGlobe}
          />

          {/* Mini Globe View */}
          <GlobeView
            center={center}
            show={showGlobe}
            isAccordionOpen={controlsAccordionOpen}
          />
        </Box>

        {/* Info Dialog */}
        <InfoDialog
          open={infoDialogOpen}
          onClose={() => setInfoDialogOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
}
