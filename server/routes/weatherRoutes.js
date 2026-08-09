const express = require('express');
const router = express.Router();

// Weather Code mapping for Open-Meteo WMO weather codes
function decodeWmoCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: '⛅' };
  if (code === 45 || code === 48) return { condition: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 67) return { condition: 'Rain Showers', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: '🌧️' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: '⛈️' };
  return { condition: 'Overcast', icon: '☁️' };
}

// GET /api/v1/weather
router.get('/', async (req, res) => {
  const { location, lat, lon } = req.query;
  const latitude = lat ? parseFloat(lat) : 28.6139;
  const longitude = lon ? parseFloat(lon) : 77.2090;
  const locationName = location || 'Field Location';

  const weatherApiKey = process.env.WEATHER_API_KEY;

  try {
    // Option A: If custom OpenWeatherMap API Key is configured
    if (weatherApiKey && weatherApiKey !== 'your_open_weather_map_api_key_here') {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`;
      const response = await fetch(owmUrl);
      if (response.ok) {
        const data = await response.json();
        return res.json({
          success: true,
          source: 'OpenWeatherMap API',
          data: {
            city: data.name || locationName,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0]?.main || 'Clear',
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            rainChance: data.clouds?.all || 10,
            uvIndex: 5,
            advisory: `Current weather at ${data.name}: ${data.weather[0]?.description}. Optimal for crop monitoring.`,
            forecast: [],
          },
        });
      }
    }

    // Option B: Real Live Meteorological Forecast via Open-Meteo (Public Live Weather API)
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto`;
    const response = await fetch(meteoUrl, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Weather service API returned HTTP status ${response.status}`,
      });
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const currentWeatherDecoded = decodeWmoCode(current.weather_code || 0);

    const forecastList = (daily.time || []).map((dateStr, idx) => {
      const decoded = decodeWmoCode(daily.weather_code ? daily.weather_code[idx] : 0);
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: idx === 0 ? 'Today' : dayName,
        tempHigh: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[idx] : 30),
        tempLow: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[idx] : 20),
        condition: decoded.condition,
        icon: decoded.icon,
        rainChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0,
      };
    });

    const rainProbToday = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    let advisoryNote = 'Optimal field conditions for standard irrigation & fertilization routine.';
    if (rainProbToday > 60) {
      advisoryNote = `High rain probability (${rainProbToday}%). Postpone pesticide spraying & standing water irrigation.`;
    } else if (current.temperature_2m > 35) {
      advisoryNote = `High field temperature (${Math.round(current.temperature_2m)}°C). Ensure adequate moisture for heat-sensitive crops.`;
    }

    return res.json({
      success: true,
      source: 'Open-Meteo Meteorological Service (Live)',
      data: {
        city: locationName,
        temperature: Math.round(current.temperature_2m || 28),
        condition: currentWeatherDecoded.condition,
        humidity: Math.round(current.relative_humidity_2m || 60),
        windSpeed: Math.round(current.wind_speed_10m || 10),
        rainChance: rainProbToday,
        uvIndex: 6,
        advisory: advisoryNote,
        forecast: forecastList,
      },
    });
  } catch (error) {
    console.error('Backend weather fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Weather service temporarily unavailable: ' + error.message,
    });
  }
});

module.exports = router;
