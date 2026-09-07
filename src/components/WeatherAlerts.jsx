import { useEffect, useMemo, useRef } from 'react';
import { buildWeatherAlerts } from '../utils/weatherAlerts';
import { useNotifications } from '../hooks/useNotifications';

const SEVERITY_ICON = { high: '🚨', medium: '⚠️', low: 'ℹ️' };

export default function WeatherAlerts({ forecast, catalog }) {
  const alerts = useMemo(() => buildWeatherAlerts(forecast, catalog || []), [forecast, catalog]);
  const { permission, requestPermission, notify } = useNotifications();
  const notifiedIds = useRef(new Set());

  useEffect(() => {
    if (permission !== 'granted') return;
    alerts
      .filter((a) => a.severity === 'high' && !notifiedIds.current.has(a.id))
      .forEach((a) => {
        notify(a.title, { body: a.description });
        notifiedIds.current.add(a.id);
      });
  }, [alerts, permission, notify]);

  return (
    <div className="cc-card">
      {permission === 'default' && (
        <button className="crop-card__edit-btn" onClick={requestPermission} style={{ marginBottom: 14 }}>
          🔔 Enable push alerts for high-severity warnings
        </button>
      )}

      <div className="cc-alerts">
        {alerts.length === 0 && (
          <p className="cc-alerts__empty">No weather alerts for your crops right now - all clear!</p>
        )}
        {alerts.map((alert) => (
          <div className={`cc-alert cc-alert--${alert.severity}`} key={alert.id}>
            <span className="cc-alert__icon">{SEVERITY_ICON[alert.severity] || '🌦️'}</span>
            <div>
              <div className="cc-alert__title">{alert.title}</div>
              <p className="cc-alert__desc">{alert.description}</p>
              <p className="cc-alert__recommendation">💡 {alert.recommendation}</p>
              {alert.affectedCrops?.length > 0 && (
                <p className="cc-alert__crops">Watch: {alert.affectedCrops.join(', ')}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
