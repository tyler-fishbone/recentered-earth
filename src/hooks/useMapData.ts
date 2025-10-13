import { useEffect, useState } from 'react';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { topoToGeoJson } from '../utils/topoToGeoJson';
import { geoGraticule10 } from 'd3-geo';

export const useMapData = () => {
  const [data, setData] = useState<FeatureCollection<Geometry> | null>(null);
  const [graticuleData, setGraticuleData] = useState<FeatureCollection | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/countries.topo.json');
        const topo = await res.json();
        const all = topoToGeoJson(topo, 'countries');

        const countries: FeatureCollection<Geometry, GeoJsonProperties> = {
          type: 'FeatureCollection',
          features: all.features.filter(
            (f: any) => f.properties?.['NAME'] !== undefined
          ),
        };
        setData(countries);

        const graticule = geoGraticule10();
        setGraticuleData({
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: graticule, properties: {} }],
        });
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, graticuleData, loading };
};
