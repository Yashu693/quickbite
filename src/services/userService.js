import { auth, db, doc, setDoc, updateDoc } from '../firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export const updateUserProfile = async (uid, data) => {
  if (!uid || !data) return;

  const userDocRef = doc(db, 'users', uid);
  
  // 1. Update Firestore
  await setDoc(userDocRef, {
    ...data,
    updatedAt: new Date(),
  }, { merge: true });

  // 2. Sync with Firebase Auth Profile Details if applicable
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    const authUpdates = {};
    if (data.displayName) authUpdates.displayName = data.displayName;
    if (data.photoURL) authUpdates.photoURL = data.photoURL;
    
    if (Object.keys(authUpdates).length > 0) {
      await updateProfile(currentUser, authUpdates);
    }
  }
};

export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user.");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
  // Re-authenticate before performing sensitive password change
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
