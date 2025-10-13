import { useMemo } from 'react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { rotateFeatureCollection } from '../utils/rotationHelpers';
import type { Center } from '../types/map';

interface UseMapLayersProps {
  data: FeatureCollection<Geometry> | null;
  graticuleData: FeatureCollection | null;
  center: Center;
  showGraticule: boolean;
}

export const useMapLayers = ({
  data,
  graticuleData,
  center,
  showGraticule,
}: UseMapLayersProps) => {
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
          getLineColor: [100, 100, 100, 150],
          lineWidthMinPixels: 1,
          wrapLongitude: true,
        }),
      rotatedData &&
        new GeoJsonLayer({
          id: 'countries',
          data: rotatedData,
          filled: true,
          stroked: true,
          getFillColor: [60, 60, 60, 200],
          getLineColor: [40, 40, 40, 255],
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

  return { layers, rotatedData, rotatedGraticule };
};
