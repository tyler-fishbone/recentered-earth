import * as topojson from "topojson-client";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

// Utility: Convert TopoJSON object → cleaned GeoJSON FeatureCollection
export function topoToGeoJson(topology: any, objectName: string): FeatureCollection<Geometry, GeoJsonProperties> {
  const numFeatures = topology.objects[objectName].geometries.length;
  if (!topology.objects || !topology.objects[objectName]) {
    throw new Error(`Object "${objectName}" not found in topology`);
  }

  // Convert to GeoJSON
  const geojson = topojson.feature(topology, topology.objects[objectName]) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

  // Filter + log invalid features
  const cleanedFeatures = geojson.features.filter((f, i) => {
    if (!f.geometry || !f.geometry.type) {
      console.warn(`Skipping feature at index ${i}: missing geometry`, f);
      return false;
    }
    if (
      (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon") &&
      (!f.geometry.coordinates || f.geometry.coordinates.length === 0)
    ) {
      console.warn(`Skipping invalid polygon at index ${i}`, f);
      return false;
    }
    return true;
  });

  console.info(
    `From ${numFeatures} topo features, loaded ${geojson.features.length} features, kept ${cleanedFeatures.length}, removed ${
      geojson.features.length - cleanedFeatures.length
    }`
  );

  return {
    type: "FeatureCollection",
    features: cleanedFeatures,
  };
}
