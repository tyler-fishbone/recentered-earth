import React, { useMemo, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { MeshPhongMaterial, Color } from 'three';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { Center } from '../types/map';
import { topoToGeoJson } from '../utils/topoToGeoJson';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

interface GlobeViewProps {
  center: Center;
  show: boolean;
  isAccordionOpen: boolean;
}

export const GlobeView: React.FC<GlobeViewProps> = ({
  center,
  show,
  isAccordionOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobilePortrait = useMediaQuery(
    '(max-width: 600px) and (orientation: portrait)'
  );
  const globeRef = useRef<any>(null);

  // Load countries data for the globe
  const [countriesData, setCountriesData] = React.useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/data/countries.topo.json');
        const topo = await res.json();
        const geoJson = topoToGeoJson(topo, 'countries');
        setCountriesData(geoJson);
      } catch (error) {
        console.error('Error loading globe data:', error);
      }
    };
    loadData();
  }, []);

  // Update globe point of view when center changes
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: center.lat, lng: center.lon }, 1000);
    }
  }, [center.lat, center.lon]);

  // Center point marker data
  const centerMarker = useMemo(
    () => [
      {
        lat: center.lat,
        lng: center.lon,
        size: 0.5,
        color: '#ff0000',
      },
    ],
    [center.lat, center.lon]
  );

  // Hide on mobile portrait by default, but allow user to toggle
  if (!show || (isMobilePortrait && !show)) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: isAccordionOpen
          ? isMobile
            ? '200px'
            : '250px'
          : isMobile
          ? '100px'
          : '130px',
        left: isMobile ? '10px' : '20px',
        width: isMobilePortrait ? '100px' : isMobile ? '150px' : '300px',
        height: isMobilePortrait ? '100px' : isMobile ? '150px' : '300px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        zIndex: 1100,
        border: '2px solid rgba(255,255,255,0.2)',
      }}
    >
      <Globe
        ref={globeRef}
        width={isMobilePortrait ? 100 : isMobile ? 150 : 300}
        height={isMobilePortrait ? 100 : isMobile ? 150 : 300}
        backgroundColor="rgba(0,0,0,0)"
        // Use a solid material color for the ocean to match main map background
        globeMaterial={
          new MeshPhongMaterial({ color: new Color('#121212'), shininess: 0 })
        }
        // No background image; keep transparent
        polygonsData={countriesData?.features || []}
        // Land color to mirror main map fill rgba(60,60,60,200)
        polygonCapColor={() => 'rgba(60,60,60,0.78)'}
        polygonSideColor={() => '#303030'}
        polygonStrokeColor={() => '#282828'}
        // Render the center marker as an HTML overlay so it is always on top
        htmlElementsData={centerMarker}
        htmlLat={(d: any) => d.lat}
        htmlLng={(d: any) => d.lng}
        htmlElement={() => {
          const el = document.createElement('div');
          el.style.width = '10px';
          el.style.height = '10px';
          el.style.borderRadius = '50%';
          el.style.background = '#ff0000';
          el.style.boxShadow = '0 0 0 2px #ffffff';
          el.style.transform = 'translate(-50%, -50%)';
          return el;
        }}
        showAtmosphere={false}
        enablePointerInteraction={false}
        animateIn={false}
      />
    </Box>
  );
};
