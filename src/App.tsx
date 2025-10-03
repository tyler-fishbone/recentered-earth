import { useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { topoToGeoJson } from "./utils/topoToGeoJson";
import { geoGraticule10 } from "d3-geo";

export default function App() {
  const [data, setData] = useState<FeatureCollection<Geometry> | null>(null);
  const [graticuleData, setGraticuleData] = useState<FeatureCollection | null>(null);
  const [latitudeOffset, setLatitudeOffset] = useState(0);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 0.5,
    bearing: 0,
  });

  function recenterLatitude(
    geoJson: FeatureCollection<Geometry, GeoJsonProperties> | null
  ): FeatureCollection<Geometry, GeoJsonProperties> | null {
    if (!geoJson) return null;

    const shiftedFeatures = geoJson.features.map((feature) => {
      const geometry = feature.geometry;
      if (!geometry) return feature;

      const newGeometry = JSON.parse(JSON.stringify(geometry));

      function shiftCoords(coords: any): any {
        if (typeof coords[0] === "number" && typeof coords[1] === "number") {
          let lat = coords[1] + latitudeOffset; // 🔑 shift latitudes
          // Clamp latitude to valid range [-90, 90]
          if (lat > 90) lat = 90;
          if (lat < -90) lat = -90;
          return [coords[0], lat];
        }
        return coords.map(shiftCoords);
      }

      newGeometry.coordinates = shiftCoords(newGeometry.coordinates);
      return { ...feature, geometry: newGeometry };
    });

    return { ...geoJson, features: shiftedFeatures };
  }

  const handleShiftLatitude = (offset: number) => {
    setLatitudeOffset((prev) => prev + offset);
  };

  const handleResetLatitude = () => {
    setLatitudeOffset(0);
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/data/countries.topo.json");
      const topo = await res.json();
      const all = topoToGeoJson(topo, "countries");
      const greenlandOnly: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: "FeatureCollection",
        features: all.features.filter((f: Feature<Geometry, GeoJsonProperties>) => f.properties?.["NAME"] !== undefined), // use to see all countries
        // features: all.features.filter((f) => f.properties?.["NAME"] === "Greenland"),
      };
      setData(greenlandOnly);
      // Get graticule & wrap it in a FeatureCollection
      const graticule = geoGraticule10();
      setGraticuleData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: graticule, properties: {} }],
      });
    };
    loadData();
  }, []);

  const recenteredData = useMemo(() => {
    return recenterLatitude(data);
  }, [data, latitudeOffset]);

  // Center point data - always at (0, 0)
  const centerPointData = useMemo(() => {
    return [{ longitude: 0, latitude: 0 }];
  }, []);

  const layers = useMemo(() => {
    return [
      graticuleData &&
        new GeoJsonLayer({
          id: "graticule",
          data: graticuleData,
          stroked: true,
          filled: false,
          getLineColor: [150, 150, 150, 200],
          lineWidthMinPixels: 1,
        }),
      recenteredData &&
        new GeoJsonLayer({
          id: "countries",
          data: recenteredData,
          filled: true,
          stroked: true,
          getFillColor: [200, 200, 200, 180],
          getLineColor: [80, 80, 80, 255],
          lineWidthMinPixels: 1,
        }),
      new ScatterplotLayer({
        id: "center-point",
        data: centerPointData,
        getPosition: (d) => [d.longitude, d.latitude],
        getRadius: 8,
        getFillColor: [255, 0, 0, 255], // Red color
        getLineColor: [255, 255, 255, 255], // White outline
        lineWidthMinPixels: 2,
        pickable: false,
        radiusMinPixels: 4,
        radiusMaxPixels: 20,
      }),
    ];
  }, [graticuleData, recenteredData, centerPointData]);

  console.log(`Latitude offset: ${latitudeOffset}`);

  return (
    <>
      <DeckGL views={new MapView({ repeat: false })} viewState={viewState} controller={true} initialViewState={viewState} layers={layers} />
      <div style={{ position: "absolute", bottom: 50, left: 10, display: "flex", gap: "10px" }}>
        <button
          onClick={() => handleShiftLatitude(10)}
          style={{
            padding: "6px 12px",
            background: "white",
            border: "1px solid #ccc",
            color: "black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Shift +10°
        </button>
        <button
          onClick={handleResetLatitude}
          style={{
            padding: "6px 12px",
            background: "white",
            border: "1px solid #ccc",
            color: "black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={() => handleShiftLatitude(-10)}
          style={{
            padding: "6px 12px",
            background: "white",
            border: "1px solid #ccc",
            color: "black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Shift -10°
        </button>
      </div>
    </>
  );
}
