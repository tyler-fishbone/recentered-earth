import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import * as topojson from "topojson-client";

export default function App() {
  const [countries, setCountries] = useState(null);

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

  return (
    <DeckGL
      views={new MapView({ repeat: true })}
      controller={{ dragRotate: false }}
      initialViewState={{ longitude: 0, latitude: 0, zoom: 0 }}
      layers={countries ? layers : []}
    />
  );
}
