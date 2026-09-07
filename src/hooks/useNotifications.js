import { useState, useCallback, useEffect } from 'react';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import { registerPushToken, onForegroundMessage } from '../utils/push-fcm';

export function useNotifications() {
  const { currentUser } = useAuth();
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const saveToken = useCallback(async (token) => {
    if (!token || !currentUser) return;
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        { fcmTokens: arrayUnion(token) },
        { merge: true }
      );
    } catch (err) {
      console.error('useNotifications: failed to save FCM token', err);
    }
  }, [currentUser]);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      setPermission('unsupported');
      return 'unsupported';
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await saveToken(await registerPushToken());
    }
    return result;
  }, [saveToken]);

  const notify = useCallback((title, options) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    try {
      new Notification(title, options);
    } catch {
      // Some browsers require a registered service worker for notifications;
      // fail silently rather than crash the alert flow.
    }
  }, []);

  // Permission may already be granted from a previous session (requestPermission
  // won't be called again), so (re)register the token whenever a signed-in user
  // shows up with permission already granted - tokens can also rotate over time.
  useEffect(() => {
    if (permission !== 'granted' || !currentUser) return;
    registerPushToken().then(saveToken);
  }, [permission, currentUser, saveToken]);

  // The service worker's onBackgroundMessage only fires when the tab/app isn't
  // in view, so surface foreground pushes through the same notify() path.
  useEffect(() => {
    if (permission !== 'granted') return;
    let unsubscribe;
    let cancelled = false;
    onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      notify(title || 'Crop Companion', { body });
    }).then((unsub) => {
      if (cancelled) unsub();
      else unsubscribe = unsub;
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [permission, notify]);

  return { permission, requestPermission, notify };
}