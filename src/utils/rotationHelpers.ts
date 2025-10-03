import { geoRotation } from 'd3-geo';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

// rotate one lon/lat point; keep lon in [-180, 180]
function rotatePoint(
  lon: number,
  lat: number,
  centerLon: number,
  centerLat: number
): [number, number] {
  const rot = geoRotation([-centerLon, -centerLat]); // move (centerLon,centerLat) to (0,0)
  const [lon2, lat2] = rot([lon, lat]) as [number, number];
  // normalize longitude
  let ln = ((lon2 + 180) % 360) - 180;
  if (ln < -180) ln += 360;
  return [ln, lat2];
}

// recursively apply to coords (Polygon, MultiPolygon, LineString, etc.)
function mapCoords(
  coords: any,
  fn: (p: [number, number]) => [number, number]
): any {
  if (typeof coords[0] === 'number') return fn(coords as [number, number]);
  return coords.map((c: any) => mapCoords(c, fn));
}

// rotate a whole FeatureCollection on-sphere (returns new lon/lat)
export function rotateFeatureCollection(
  fc: FeatureCollection<Geometry, GeoJsonProperties>,
  centerLon: number,
  centerLat: number
): FeatureCollection<Geometry, GeoJsonProperties> {
  const fn = (p: [number, number]) =>
    rotatePoint(p[0], p[1], centerLon, centerLat);

  const processedFeatures = fc.features.map(f => {
    const g = f.geometry as any;
    if (!g || !('coordinates' in g)) return f; // skip GeometryCollection for now

    // Apply rotation to coordinates
    const rotatedCoords = mapCoords(g.coordinates, fn);

    return {
      ...f,
      geometry: {
        ...g,
        coordinates: rotatedCoords,
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features: processedFeatures,
  };
}
