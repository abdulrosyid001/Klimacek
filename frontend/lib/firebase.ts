import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Debug environment variables
console.log('Environment check:', {
  hasApiKey: !!process.env.FIREBASE_API_KEY,
  hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
  hasDatabaseURL: !!process.env.FIREBASE_DATABASE_URL
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);