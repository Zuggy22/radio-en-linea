export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
}

export interface PlayerState {
  isPlaying: boolean;
  volume: number;
  station: Station | null;
  isLoading: boolean;
  error: string | null;
}

export enum ViewMode {
  GRID = 'GRID',
  LIST = 'LIST'
}