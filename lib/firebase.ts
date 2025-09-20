import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if we have required Firebase configuration
const hasFirebaseConfig = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.databaseURL
);

// Function to get database instance
export const getDB = () => {
  if (!hasFirebaseConfig) {
    throw new Error('Firebase configuration is missing. Please check your environment variables.');
  }

  // Initialize Firebase app (avoid multiple initializations)
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getDatabase(app);
};

// For client-side use
let clientDB: any = null;
if (typeof window !== 'undefined' && hasFirebaseConfig) {
  console.log('Client Environment check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasDatabaseURL: !!firebaseConfig.databaseURL
  });
  clientDB = getDB();
}

// For server-side use (only when Firebase config is available)
let serverDB: any = null;
if (typeof window === 'undefined' && hasFirebaseConfig) {
  console.log('Server Environment check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasDatabaseURL: !!firebaseConfig.databaseURL
  });
  try {
    serverDB = getDB();
  } catch (error) {
    console.warn('Failed to initialize Firebase on server:', error);
  }
}

// Export db - will be null during build time if config is missing
export const db = clientDB || serverDB;