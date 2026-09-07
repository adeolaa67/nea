import { useState, useEffect, useCallback } from 'react';

const GEO_SUPPORTED = typeof navigator !== 'undefined' && 'geolocation' in navigator;

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(GEO_SUPPORTED ? null : 'Geolocation is not supported in this browser.');
  const [status, setStatus] = useState(GEO_SUPPORTED ? 'loading' : 'error');

  const requestLocation = useCallback(() => {
    if (!GEO_SUPPORTED) return;
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setError(null);
        setStatus('success');
      },
      (err) => {
        setError(err.message);
        setStatus('error');
      },
      { timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
    // Only auto-request once on mount - requestLocation is stable (useCallback, no deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { position, error, status, requestLocation };
}