import { db, collection, addDoc, serverTimestamp, updateDoc } from '../firebase';
import { uploadFeedbackScreenshot } from './storageService';

export const submitFeedback = async (uid, feedbackData, screenshotFile = null) => {
  if (!uid || !feedbackData) throw new Error('Invalid feedback data');

  // Create initial doc
  const docRef = await addDoc(collection(db, 'feedback'), {
    ...feedbackData,
    uid,
    timestamp: serverTimestamp(),
    status: 'pending',
    platform: 'web',
    screenshotURL: null // Default
  });

  // If screenshot was provided, upload and link it
  if (screenshotFile) {
    try {
      // Prevent indefinite hang if Firebase Storage isn't properly initialized or configured
      const uploadPromise = uploadFeedbackScreenshot(uid, docRef.id, screenshotFile);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Storage upload timed out. (Is Firebase Storage enabled and Rules set?)")), 8000));
      
      const downloadURL = await Promise.race([uploadPromise, timeoutPromise]);
      await updateDoc(docRef, { screenshotURL: downloadURL });
    } catch (err) {
      console.error("Screenshot upload error:", err);
      // We don't want to completely fail the feedback since the text already saved
      throw new Error("Your text feedback was saved, but the screenshot failed to upload: " + err.message);
    }
  }

  return docRef.id;
};
