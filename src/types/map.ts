export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
}

export interface Center {
  lon: number;
  lat: number;
}

export interface MapData {
  countries: any;
  graticule: any;
}

export interface Layer {
  id: string;
  data: any;
  // Add other layer properties as needed
}
