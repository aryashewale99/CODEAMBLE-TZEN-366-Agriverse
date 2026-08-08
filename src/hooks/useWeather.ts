import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types/agri';
import { weatherService } from '../services/weatherService';

export const useWeather = (location?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getCurrentWeather(location);
      setWeather(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refresh: fetchWeather };
};
