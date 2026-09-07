import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app } from '../firebase';

// Web Push certificate (VAPID) key, from Firebase console -> Project settings
// -> Cloud Messaging -> Web configuration -> Generate key pair.
const VAPID_KEY = 'BEPq5BuBWp6ioxle3QIARBtykeftJyHjQdSPkaZa_-3XXFoQDUeZl_2eooiCwd3Fohk3QZEElPy3RawOzsMIXB8';

export async function registerPushToken() {
  if (!(await isSupported())) return null;
  if (!VAPID_KEY) {
    console.warn('push-fcm: VAPID_KEY is not set - skipping FCM registration.');
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const messaging = getMessaging(app);
    return await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
  } catch (err) {
    console.error('push-fcm: failed to get FCM token', err);
    return null;
  }
}

export async function onForegroundMessage(callback) {
  if (!(await isSupported())) return () => {};
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
}
