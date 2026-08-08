import { WeatherData } from '../types/agri';

export const weatherService = {
  async getCurrentWeather(location = 'North Field Sector 4'): Promise<WeatherData> {
    return {
      city: location,
      temperature: 29,
      condition: 'Partly Cloudy',
      humidity: 68,
      windSpeed: 14,
      rainChance: 25,
      uvIndex: 6,
      advisory: 'Optimal weather for irrigation today. Light evening rainfall expected.',
      forecast: [
        { day: 'Mon', tempHigh: 31, tempLow: 22, condition: 'Sunny', icon: '☀️', rainChance: 10 },
        { day: 'Tue', tempHigh: 30, tempLow: 21, condition: 'Cloudy', icon: '☁️', rainChance: 40 },
        { day: 'Wed', tempHigh: 28, tempLow: 20, condition: 'Rain', icon: '🌧️', rainChance: 80 },
        { day: 'Thu', tempHigh: 29, tempLow: 21, condition: 'Thunderstorm', icon: '⛈️', rainChance: 65 },
        { day: 'Fri', tempHigh: 32, tempLow: 23, condition: 'Clear', icon: '☀️', rainChance: 5 },
      ],
    };
  },
};
