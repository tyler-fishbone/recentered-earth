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
import { Button, Stack } from '@mui/material';

export default function App() {
  const [data, setData] = useState<FeatureCollection<Geometry> | null>(null);
  const [graticuleData, setGraticuleData] = useState<FeatureCollection | null>(
    null
  );

  // rotation center — this is the “new 0,0” for projection
  const [center, setCenter] = useState<{ lon: number; lat: number }>({
    lon: 0,
    lat: 0,
  });

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
      rotatedGraticule &&
        new GeoJsonLayer({
          id: 'graticule',
          data: rotatedGraticule,
          stroked: true,
          filled: false,
          getLineColor: [150, 150, 150, 200],
          lineWidthMinPixels: 1,
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
  }, [rotatedGraticule, rotatedData, centerPointData]);

  return (
    <>
      <DeckGL
        views={new MapView({ repeat: true })}
        viewState={viewState}
        controller={true}
        initialViewState={viewState}
        layers={layers}
      />

      <Stack
        style={{
          position: 'absolute',
          bottom: 50,
          right: 10,
          display: 'flex',
          gap: '10px',
          width: '350px',
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="center" width="100%">
          <Button
            onClick={() =>
              setCenter(c => ({ ...c, lat: Math.min(c.lat + 10, 85) }))
            }
            variant="contained"
          >
            Lat +10°
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() =>
              setCenter(c => ({ ...c, lon: ((c.lon - 10 + 540) % 360) - 180 }))
            }
            variant="contained"
          >
            Lon -10°
          </Button>
          <Button
            onClick={() => setCenter({ lon: 0, lat: 0 })}
            variant="contained"
          >
            Reset
          </Button>
          <Button
            onClick={() =>
              setCenter(c => ({ ...c, lon: ((c.lon + 10 + 540) % 360) - 180 }))
            }
            variant="contained"
          >
            Lon +10°
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" width="100%">
          <Button
            onClick={() =>
              setCenter(c => ({ ...c, lat: Math.max(c.lat - 10, -85) }))
            }
            variant="contained"
          >
            Lat -10°
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
