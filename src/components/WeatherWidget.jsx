import { useEffect, useRef, useState } from 'react';

// Receives weather/location state as props rather than calling useWeather
// itself - dashboard.jsx wires useGeolocation + useWeather once at the top
// level so WeatherAlerts can reuse the same forecast without a second fetch.
export default function WeatherWidget({
  weather, locationLabel, loading, error, geoStatus, geoError, onRetryLocation,
  hasOverride, onClearOverride, onSearchLocation, autoOpenSearch
}) {
  const [searchOpen, setSearchOpen] = useState(Boolean(autoOpenSearch));
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoOpenSearch) {
      setSearchOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [autoOpenSearch]);

  async function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      await onSearchLocation(query.trim());
      setSearchOpen(false);
      setQuery('');
    } catch (err) {
      setSearchError(err.message || 'Could not find that place.');
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="cc-card cc-weather">
      {geoStatus === 'error' && !hasOverride && (
        <div className="cc-weather__geo-banner">
          <span>📍 Showing {locationLabel} - {geoError || 'location unavailable'}.</span>
          <button type="button" onClick={onRetryLocation}>Use my location</button>
        </div>
      )}

      <div className="cc-weather__location-bar">
        <span className="cc-weather__location-current">📍 {locationLabel}</span>
        <div className="cc-weather__location-actions">
          {hasOverride && (
            <button type="button" className="cc-weather__link-btn" onClick={onClearOverride}>
              Use my GPS location
            </button>
          )}
          <button
            type="button"
            className="cc-weather__link-btn"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? 'Cancel' : 'Set location'}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form className="cc-weather__search" onSubmit={handleSearchSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter a town or city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={searching}>{searching ? 'Finding…' : 'Set'}</button>
          {searchError && <p className="cc-weather__search-error">{searchError}</p>}
        </form>
      )}

      <div className="cc-weather__now">
        {loading && <p>Loading weather…</p>}
        {!loading && error && <p className="cc-muted">{error}</p>}
        {!loading && weather && (
          <>
            <span className="cc-weather__emoji">{weather.emoji}</span>
            <span className="cc-weather__temp">{weather.temperature}°C</span>
            <span className="cc-weather__label">{weather.label}</span>
            <div className="cc-weather__meta">
              <span>💧 {weather.humidity}%</span>
              <span>💨 {weather.windSpeed} km/h</span>
            </div>
          </>
        )}
      </div>

      <div className="cc-weather__forecast">
        {weather?.forecast?.map((day) => (
          <div className="cc-weather__day" key={day.date}>
            <div className="cc-weather__day-name">{day.day}</div>
            <div className="cc-weather__day-emoji">{day.emoji}</div>
            <div className="cc-weather__day-temps">
              <strong>{day.tempMax}°</strong>
              <span>{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
