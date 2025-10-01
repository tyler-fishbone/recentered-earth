import { useEffect, useState, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import * as topojson from "topojson-client";

export default function App() {
  const [countries, setCountries] = useState(null);
  const [viewState, setViewState] = useState({ longitude: 0, latitude: 0, zoom: 2 });
  const lastDragging = useRef(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch("/data/countries.topo.json");
        const topology = await res.json();
        const geojson = topojson.feature(topology, topology.objects.countries);
        setCountries(geojson);
      } catch (error) {
        console.error("Failed to load countries data:", error);
      }
    };

    loadCountries();
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: "countries",
      data: countries,
      filled: true,
      stroked: true,
      getFillColor: [200, 200, 200, 180],
      getLineColor: [80, 80, 80, 255],
      lineWidthMinPixels: 1,
      pickable: true,
    }),
  ];

  const handleReset = () => {
    setViewState({ longitude: 0, latitude: 0, zoom: 2 });
  };

  const handleViewStateChange = ({ viewState, interactionState }) => {
    setViewState(viewState);

    if (interactionState) {
      if (interactionState.isDragging && !lastDragging.current) {
        console.log("Drag started");
      }

      if (!interactionState.isDragging && lastDragging.current) {
        console.log("Drag stopped");
        // 👉 put your custom action here
      }

      lastDragging.current = interactionState.isDragging;
    }
  };
  const zeroState = viewState.latitude === 0 && viewState.longitude === 0;
  return (
    <>
      <DeckGL
        views={new MapView({ repeat: true })}
        controller={{ dragRotate: true }}
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        layers={countries ? layers : []}
      />
      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          padding: "6px 12px",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
          color: zeroState ? "gray" : "black",
          disabled: zeroState,
        }}
      >
        Reset Center
      </button>
    </>
  );
}
