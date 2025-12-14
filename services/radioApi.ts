import { Station } from '../types';

const API_BASE_URL = 'https://de1.api.radio-browser.info/json/stations';

export const getTopStations = async (limit: number = 20): Promise<Station[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/topvote/${limit}?hidebroken=true`);
    if (!response.ok) throw new Error('Failed to fetch top stations');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const searchStations = async (query: string, tag: string = ''): Promise<Station[]> => {
  try {
    // Only fetch https stations to avoid mixed content warnings in modern browsers
    let url = `${API_BASE_URL}/search?limit=30&hidebroken=true&order=clickcount&reverse=true&is_https=true`;
    
    if (query) {
      url += `&name=${encodeURIComponent(query)}`;
    }
    
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search stations');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const getByGenre = async (genre: string): Promise<Station[]> => {
    return searchStations('', genre);
}