import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadProfilePhoto = async (uid, file) => {
  if (!uid || !file) throw new Error('Invalid upload parameters');
  
  // Create a secure reference in storage
  const ext = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `users/${uid}/profile.${ext}`);
  
  // Upload and grab URL
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

export const uploadFeedbackScreenshot = async (uid, docId, file) => {
  if (!uid || !docId || !file) throw new Error('Invalid upload parameters');
  
  const ext = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `feedback/${uid}/${docId}.${ext}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
