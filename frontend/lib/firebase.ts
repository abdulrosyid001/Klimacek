import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDYJpxwibPgJiH418xvjrLJXv_W6opaNbo",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "atamagri-iot.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.FIREBASE_PROJECT_ID || "atamagri-iot",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "atamagri-iot.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "745512120451",
  appId: process.env.FIREBASE_APP_ID || "1:745512120451:web:6cfdd1aab20747f675ebb6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);