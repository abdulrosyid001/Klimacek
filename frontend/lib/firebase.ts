import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Only run in browser environment
const isClient = typeof window !== 'undefined';

if (isClient) {
  console.log('Environment check:', {
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasDatabaseURL: !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Function to initialize Firebase - only called when needed
const initializeFirebase = () => {
  // Check if all required Firebase config values are present
  const requiredConfigKeys = ['apiKey', 'projectId', 'databaseURL'];
  const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.warn('Missing Firebase configuration keys:', missingKeys);
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }

  // Initialize Firebase app (avoid multiple initializations)
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
};

// Export a function to get the database instance
export const getFirebaseDB = () => {
  if (!isClient) {
    throw new Error('Firebase can only be used in the browser');
  }

  const app = initializeFirebase();
  return getDatabase(app);
};

// For backward compatibility, export db but make it lazy
let _db: any = null;
export const db = new Proxy({} as any, {
  get(target, prop) {
    if (!_db) {
      _db = getFirebaseDB();
    }
    return _db[prop];
  }
});