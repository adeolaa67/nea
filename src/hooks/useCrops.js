import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from 'firebase/firestore';

export function useCrops() {
  const { currentUser } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      // Resetting to the signed-out state in response to an external auth
      // event (logout), not a value derivable from props/state at render time.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCrops([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'crops'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCrops(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [currentUser]);

  async function addCrop(cropData) {
    if (!currentUser) throw new Error('You need to be logged in to add a crop.');
    const docRef = await addDoc(collection(db, 'crops'), {
      ...cropData,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  async function updateCrop(cropId, updates) {
    await updateDoc(doc(db, 'crops', cropId), updates);
  }

  async function deleteCrop(crop) {
    await deleteDoc(doc(db, 'crops', crop.id));
  }

  return { crops, loading, addCrop, updateCrop, deleteCrop };
}
