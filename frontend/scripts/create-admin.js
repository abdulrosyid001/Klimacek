// Script to create an admin user
// Run this with: node scripts/create-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const readline = require('readline');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAl0tpMNAA_g0FPfJhPPRrOT7EAYKgGleQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "atamagri-cc5c1.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://atamagri-cc5c1-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "atamagri-cc5c1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "atamagri-cc5c1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "266957728071",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:266957728071:web:0f86c7223166f185ef8462"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Create Admin User ===');
console.log('This will create an admin user with email: admin@atamagri.com');
console.log('');

rl.question('Enter password for admin@atamagri.com (min 6 characters): ', async (password) => {
  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters');
    rl.close();
    process.exit(1);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@atamagri.com',
      password
    );

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    console.log('');
    console.log('You can now login with:');
    console.log('Email: admin@atamagri.com');
    console.log('Password: [the password you just entered]');

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Admin user already exists');
      console.log('Email: admin@atamagri.com');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  } finally {
    rl.close();
    process.exit(0);
  }
});