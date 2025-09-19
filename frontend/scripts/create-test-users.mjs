import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('🔧 Firebase Project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createTestUsers() {
  console.log('\n📝 Creating test users for Firebase Authentication...\n');

  const users = [
    {
      email: 'admin@atamagri.com',
      password: 'Admin@Atamagri2024!',
      role: 'Admin'
    },
    {
      email: 'test@atamagri.com',
      password: 'Test@Atamagri2024!',
      role: 'Test User'
    }
  ];

  for (const user of users) {
    try {
      console.log(`Creating ${user.role}: ${user.email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      console.log(`✅ ${user.role} created successfully!`);
      console.log(`   UID: ${userCredential.user.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  ${user.role} already exists`);

        // Try to sign in to verify credentials
        try {
          await signInWithEmailAndPassword(auth, user.email, user.password);
          console.log(`   ✅ Credentials verified`);
        } catch (signInError) {
          console.log(`   ❌ Could not verify credentials: ${signInError.message}`);
        }
      } else {
        console.error(`❌ Error creating ${user.role}:`, error.message);
      }
    }
  }

  console.log('\n✅ User setup complete!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin: admin@atamagri.com / Admin@Atamagri2024!');
  console.log('   Test:  test@atamagri.com / Test@Atamagri2024!');

  process.exit(0);
}

createTestUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});