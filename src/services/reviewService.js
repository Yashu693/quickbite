import { db, doc, setDoc, getDoc, serverTimestamp } from '../firebase';

export const submitReview = async (uid, reviewData) => {
  if (!uid || !reviewData) throw new Error('Invalid review data');

  const reviewRef = doc(db, 'reviews', uid);
  
  await setDoc(reviewRef, {
    ...reviewData,
    uid, // Enforce one review per user logic based on firestore rules
    timestamp: serverTimestamp(),
    platform: 'web'
  }, { merge: true });
};

export const getUserReview = async (uid) => {
  if (!uid) return null;
  const reviewRef = doc(db, 'reviews', uid);
  const snapshot = await getDoc(reviewRef);
  
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};
