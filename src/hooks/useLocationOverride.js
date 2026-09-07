import { useCallback, useState } from 'react';

const STORAGE_KEY = 'cc-location-override';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Lets a user type a place name instead of relying on browser geolocation -
// used both by the dashboard's weather widget and the Welcome page's
// "Set Location" leaf button. Persisted to localStorage so it survives a
// refresh even if geolocation permission was denied.
export function useLocationOverride() {
  const [override, setOverrideState] = useState(readStored);

  const setOverride = useCallback((value) => {
    setOverrideState(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (e.g. private browsing) - state still updates
    }
  }, []);

  const searchLocation = useCallback(async (query) => {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    if (!res.ok) throw new Error('Location search failed');
    const data = await res.json();
    const place = data?.results?.[0];
    if (!place) throw new Error(`Could not find "${query}". Try a city name.`);
    const value = {
      latitude: place.latitude,
      longitude: place.longitude,
      label: `${place.name}, ${place.admin1 || place.country}`
    };
    setOverride(value);
    return value;
  }, [setOverride]);

  return { override, setOverride, searchLocation };
}
