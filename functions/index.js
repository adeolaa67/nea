import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { buildWeatherAlerts } from './weatherAlerts.js';

initializeApp();
const db = getFirestore();
const messaging = getMessaging();

async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum',
    timezone: 'auto',
    forecast_days: '5'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
  const data = await res.json();
  return data.daily.time.map((date, i) => ({
    date,
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
    precipitation: Math.round(data.daily.precipitation_sum[i])
  }));
}

async function pruneInvalidTokens(userId, tokens, responses) {
  const invalid = tokens.filter((_, i) => {
    const code = responses[i]?.error?.code;
    return code === 'messaging/registration-token-not-registered'
      || code === 'messaging/invalid-registration-token';
  });
  if (invalid.length === 0) return;
  await db.doc(`users/${userId}`).update({ fcmTokens: FieldValue.arrayRemove(...invalid) });
}

async function processUser(userId, userData) {
  const tokens = userData.fcmTokens || [];
  const position = userData.position;
  if (tokens.length === 0 || !position?.latitude || !position?.longitude) return;

  const cropsSnap = await db.collection('crops').where('userId', '==', userId).get();
  const catalog = cropsSnap.docs.map((d) => d.data());

  const forecast = await fetchForecast(position.latitude, position.longitude);
  const highAlerts = buildWeatherAlerts(forecast, catalog).filter((a) => a.severity === 'high');
  if (highAlerts.length === 0) return;

  const title = highAlerts.length === 1
    ? highAlerts[0].title
    : `${highAlerts.length} high-severity weather alerts`;
  const body = highAlerts.map((a) => a.description).join(' ');

  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: { title, body }
  });
  await pruneInvalidTokens(userId, tokens, response.responses);
}

export const checkWeatherAlerts = onSchedule('every 6 hours', async () => {
  const usersSnap = await db.collection('users').get();
  await Promise.all(
    usersSnap.docs.map((snap) =>
      processUser(snap.id, snap.data()).catch((err) =>
        console.error(`checkWeatherAlerts: failed for user ${snap.id}`, err)
      )
    )
  );
});
