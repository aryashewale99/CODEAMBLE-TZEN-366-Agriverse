import { WeatherData } from '../types/agri';
import apiClient from './apiClient';

export const weatherService = {
  async getCurrentWeather(location = 'North Field Sector 4', lat?: number, lon?: number): Promise<WeatherData> {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<{ success: boolean; data: WeatherData }>(`/weather${queryString}`);
    if (res && res.success && res.data) {
      return res.data;
    }
    throw new Error('Weather data unavailable from backend service.');
  },
};

export default weatherService;
