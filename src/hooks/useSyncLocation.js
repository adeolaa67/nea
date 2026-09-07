import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';

// Persists the signed-in user's last-known coordinates to Firestore so the
// scheduled weather-alert Cloud Function can fetch a forecast for them
// without needing their browser to be open.
export function useSyncLocation(position) {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!position || !currentUser) return;
    setDoc(
      doc(db, 'users', currentUser.uid),
      { position: { latitude: position.latitude, longitude: position.longitude } },
      { merge: true }
    ).catch((err) => console.error('useSyncLocation: failed to save position', err));
  }, [position, currentUser]);
}
