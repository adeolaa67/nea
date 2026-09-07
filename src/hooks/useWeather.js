import { useState, useEffect } from 'react';
import { describeWeatherCode } from '../utils/weatherAlerts';

// Sacramento, CA - a last-resort default, only used until the browser's
// geolocation resolves (or the user sets a location manually) - see
// WeatherWidget's "Set location" search and useLocationOverride.
const FALLBACK_COORDS = { latitude: 38.5816, longitude: -121.4944 };
const FALLBACK_LABEL = 'your area (locating…)';

export function useWeather(position) {
  const [weather, setWeather] = useState(null);
  const [locationLabel, setLocationLabel] = useState(FALLBACK_LABEL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const coords = position || FALLBACK_COORDS;
    let cancelled = false;

    async function fetchWeather() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          latitude: coords.latitude,
          longitude: coords.longitude,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          daily: 'temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum',
          timezone: 'auto',
          forecast_days: '5'
        });
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        if (!res.ok) throw new Error('Weather request failed');
        const data = await res.json();

        const current = describeWeatherCode(data.current.weather_code);
        const forecast = data.daily.time.map((date, i) => ({
          date,
          day: new Date(date).toLocaleDateString('en-GB', { weekday: 'short' }),
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
          precipitation: Math.round(data.daily.precipitation_sum[i]),
          ...describeWeatherCode(data.daily.weather_code[i])
        }));

        if (cancelled) return;

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: current.condition,
          emoji: current.emoji,
          label: current.label,
          forecast
        });
        setError(null);

        if (position) {
          try {
            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coords.latitude}&longitude=${coords.longitude}`
            );
            const geoData = await geoRes.json();
            const place = geoData?.results?.[0];
            if (place && !cancelled) {
              setLocationLabel(`${place.name}, ${place.admin1 || place.country}`);
            }
          } catch {
            // reverse geocoding is best-effort only, keep the previous label
          }
        }
      } catch {
        if (!cancelled) setError('Could not load live weather right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, [position]);

  return { weather, locationLabel, loading, error };
}