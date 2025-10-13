import React from 'react';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import type { ViewState } from '../types/map';

interface MapProps {
  viewState: ViewState;
  onViewStateChange: (viewState: ViewState) => void;
  layers: any[];
}

export const Map: React.FC<MapProps> = ({
  viewState,
  onViewStateChange,
  layers,
}) => {
  return (
    <DeckGL
      views={new MapView({ repeat: false })}
      viewState={viewState}
      onViewStateChange={({ viewState }) =>
        onViewStateChange({
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          bearing: viewState.bearing || 0,
        })
      }
      controller={true}
      initialViewState={viewState}
      layers={layers}
    />
  );
};
