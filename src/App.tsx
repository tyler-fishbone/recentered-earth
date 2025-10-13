import { useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { topoToGeoJson } from './utils/topoToGeoJson';
import { geoGraticule10 } from 'd3-geo';
import { rotateFeatureCollection } from './utils/rotationHelpers'; // 👈 new helper file we created
import {
  Button,
  Stack,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { InfoOutlined, ExpandMore, Settings, Close } from '@mui/icons-material';

export default function App() {
  const [data, setData] = useState<FeatureCollection<Geometry> | null>(null);
  const [graticuleData, setGraticuleData] = useState<FeatureCollection | null>(
    null
  );

  // rotation center — this is the "new 0,0" for projection
  const [center, setCenter] = useState<{ lon: number; lat: number }>({
    lon: 0,
    lat: 0,
  });

  // toggle for graticule visibility
  const [showGraticule, setShowGraticule] = useState(false);

  // UI state
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [controlsAccordionOpen, setControlsAccordionOpen] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 0.5,
    bearing: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/data/countries.topo.json');
      const topo = await res.json();
      const all = topoToGeoJson(topo, 'countries');

      const countries: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features: all.features.filter(
          (f: Feature<Geometry, GeoJsonProperties>) =>
            f.properties?.['NAME'] !== undefined
        ),
      };
      setData(countries);
      console.log(countries);

      const graticule = geoGraticule10();
      setGraticuleData({
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: graticule, properties: {} }],
      });
    };
    loadData();
  }, []);

  // rotate data + graticule using current center
  const rotatedData = useMemo(() => {
    if (!data) return null;
    return rotateFeatureCollection(data, center.lon, center.lat);
  }, [data, center]);

  const rotatedGraticule = useMemo(() => {
    if (!graticuleData) return null;
    return rotateFeatureCollection(
      graticuleData as FeatureCollection<Geometry, GeoJsonProperties>,
      center.lon,
      center.lat
    );
  }, [graticuleData, center]);

  // red center point
  const centerPointData = useMemo(() => [{ longitude: 0, latitude: 0 }], []);

  const layers = useMemo(() => {
    return [
      showGraticule &&
        rotatedGraticule &&
        new GeoJsonLayer({
          id: 'graticule',
          data: rotatedGraticule,
          stroked: true,
          filled: false,
          getLineColor: [150, 150, 150, 200],
          lineWidthMinPixels: 1,
          wrapLongitude: true,
        }),
      rotatedData &&
        new GeoJsonLayer({
          id: 'countries',
          data: rotatedData,
          filled: true,
          stroked: true,
          getFillColor: [200, 200, 200, 180],
          getLineColor: [80, 80, 80, 255],
          lineWidthMinPixels: 1,
          wrapLongitude: true,
        }),
      new ScatterplotLayer({
        id: 'center-point',
        data: centerPointData,
        getPosition: d => [d.longitude, d.latitude],
        getRadius: 8,
        getFillColor: [255, 0, 0, 255],
        getLineColor: [255, 255, 255, 255],
        lineWidthMinPixels: 2,
        pickable: false,
        radiusMinPixels: 4,
        radiusMaxPixels: 20,
      }),
    ].filter(Boolean);
  }, [showGraticule, rotatedGraticule, rotatedData, centerPointData]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recentered Earth
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setInfoDialogOpen(true)}
            aria-label="About Recentered Earth"
          >
            <InfoOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <DeckGL
          views={new MapView({ repeat: false })}
          viewState={viewState}
          onViewStateChange={({ viewState }) =>
            setViewState({
              longitude: viewState.longitude,
              latitude: viewState.latitude,
              zoom: viewState.zoom,
              bearing: viewState.bearing || 0,
            })
          }
          controller={true}
          initialViewState={viewState}
          layers={layers}
        />

        {/* Navigation Controls - Above Accordion */}
        <Box
          sx={{
            position: 'absolute',
            bottom: controlsAccordionOpen ? 200 : 60,
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
                onClick={() =>
                  setViewState(v => ({
                    ...v,
                    bearing: (v.bearing + 90) % 360,
                  }))
                }
                variant="contained"
                color="secondary"
                size="small"
              >
                Rotate 90°
              </Button>
              <Button
                onClick={() =>
                  setViewState(v => ({
                    ...v,
                    bearing: (v.bearing + 180) % 360,
                  }))
                }
                variant="contained"
                color="secondary"
                size="small"
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
                  onClick={() =>
                    setCenter(c => ({
                      ...c,
                      lat: Math.min(c.lat + 10, 85),
                    }))
                  }
                  variant="contained"
                  size="small"
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
                  onClick={() =>
                    setCenter(c => ({
                      ...c,
                      lon: ((c.lon - 10 + 540) % 360) - 180,
                    }))
                  }
                  variant="contained"
                  size="small"
                >
                  Lon -10°
                </Button>
                <Button
                  onClick={() => setCenter({ lon: 0, lat: 0 })}
                  variant="contained"
                  size="small"
                >
                  Reset
                </Button>
                <Button
                  onClick={() =>
                    setCenter(c => ({
                      ...c,
                      lon: ((c.lon + 10 + 540) % 360) - 180,
                    }))
                  }
                  variant="contained"
                  size="small"
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
                  onClick={() =>
                    setCenter(c => ({
                      ...c,
                      lat: Math.max(c.lat - 10, -85),
                    }))
                  }
                  variant="contained"
                  size="small"
                >
                  Lat -10°
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {
          /* Map Controls Accordion - Bottom */
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
              expanded={controlsAccordionOpen}
              onChange={() => setControlsAccordionOpen(!controlsAccordionOpen)}
              sx={{
                borderRadius: controlsAccordionOpen ? '16px 16px 0 0' : '16px',
                '&:before': { display: 'none' },
                boxShadow: 3,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  minHeight: 48,
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1,
                  },
                }}
              >
                <Settings />
                <Typography variant="subtitle1">Map Controls</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3} sx={{ p: 2 }}>
                  {/* Graticule Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showGraticule}
                        onChange={e => setShowGraticule(e.target.checked)}
                      />
                    }
                    label="Show Graticule"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        }

        {/* Info Dialog */}
        <Dialog
          open={infoDialogOpen}
          onClose={() => setInfoDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            About Recentered Earth
            <IconButton
              onClick={() => setInfoDialogOpen(false)}
              aria-label="close"
              size="small"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Recentered Earth lets you explore how perspective shapes geography
              by shifting the center of the world map. Use the controls below to
              move, zoom, and toggle map layers.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This interactive tool demonstrates how different map projections
              and center points can dramatically change our perception of global
              relationships and distances. Experiment with the latitude and
              longitude controls to see how the world looks from different
              viewpoints.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setInfoDialogOpen(false)}
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
