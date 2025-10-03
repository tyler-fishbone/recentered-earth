import { useEffect, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { topoToGeoJson } from "./utils/topoToGeoJson";
import { geoGraticule10 } from "d3-geo";

export default function App() {
  const [data, setData] = useState<FeatureCollection<Geometry> | null>(null);
  const [graticuleData, setGraticuleData] = useState<FeatureCollection | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 0.5,
    bearing: 0,
  });
  const handleFlip = () => {
    setViewState((prev) => ({
      ...prev,
      bearing: prev.bearing + 180,
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/data/countries.topo.json");
      const topo = await res.json();
      const all = topoToGeoJson(topo, "countries");
      console.log(all);
      const greenlandOnly: FeatureCollection<Geometry, GeoJsonProperties> = {
        type: "FeatureCollection",
        features: all.features.filter((f) => f.properties?.["NAME"] === "Greenland"),
      };
      console.log(greenlandOnly);
      setData(greenlandOnly);
      const graticule = geoGraticule10();
      console.log(graticule);
      // Wrap it in a FeatureCollection
      setGraticuleData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: graticule, properties: {} }],
      });
    };
    loadData();
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
      data &&
        new GeoJsonLayer({
          id: "greenland",
          data,
          filled: true,
          stroked: true,
          getFillColor: [200, 200, 200, 180],
          getLineColor: [80, 80, 80, 255],
          lineWidthMinPixels: 1,
        }),
    ];
  }, [graticuleData, data]);

  return (
    <>
      <DeckGL views={new MapView({ repeat: true })} viewState={viewState} controller={true} initialViewState={viewState} layers={layers} />
      <button
        onClick={handleFlip}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          padding: "6px 12px",
          background: "white",
          border: "1px solid #ccc",
          color: "black",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {viewState.bearing === 0 ? "South-Up" : "North-Up"}
      </button>
    </>
  );
}
