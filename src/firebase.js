import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8LN1JkjCsZov8aMuAlBBZPigzYf4te8c",
  authDomain: "quickbite-fa414.firebaseapp.com",
  projectId: "quickbite-fa414",
  storageBucket: "quickbite-fa414.firebasestorage.app",
  messagingSenderId: "662907773845",
  appId: "1:662907773845:web:d733dabb823e3f77f88c9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);