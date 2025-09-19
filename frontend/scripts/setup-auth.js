const admin = require('firebase-admin');

// Initialize Admin SDK with service account
const serviceAccount = {
  type: "service_account",
  project_id: "atamagri-iot",
  private_key_id: "fb29db8cbef9c7c0e57f2e7c2c5e3b5f8b5e5a5e",
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
  client_email: "firebase-adminsdk-fbsvc@atamagri-iot.iam.gserviceaccount.com",
  client_id: "107426789123456789012",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40atamagri-iot.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize the app if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://atamagri-iot-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

async function setupAuth() {
  console.log('Setting up Firebase Authentication...\n');

  try {
    // Create admin user
    const adminEmail = 'admin@atamagri.com';
    const adminPassword = 'Admin@Atamagri2024!';

    try {
      const adminUser = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true,
        displayName: 'Admin User'
      });

      // Set admin custom claim
      await admin.auth().setCustomUserClaims(adminUser.uid, { admin: true });

      console.log('✅ Admin user created successfully');
      console.log('   Email:', adminEmail);
      console.log('   UID:', adminUser.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  Admin user already exists');

        // Get the existing user and set admin claim
        const existingUser = await admin.auth().getUserByEmail(adminEmail);
        await admin.auth().setCustomUserClaims(existingUser.uid, { admin: true });
        console.log('   Admin claim updated for existing user');
      } else {
        throw error;
      }
    }

    // Create test user
    const testEmail = 'test@atamagri.com';
    const testPassword = 'Test@Atamagri2024!';

    try {
      const testUser = await admin.auth().createUser({
        email: testEmail,
        password: testPassword,
        emailVerified: true,
        displayName: 'Test User'
      });

      console.log('\n✅ Test user created successfully');
      console.log('   Email:', testEmail);
      console.log('   UID:', testUser.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('\n⚠️  Test user already exists');
      } else {
        throw error;
      }
    }

    // List all users
    console.log('\n📋 Current users in the system:');
    const listUsersResult = await admin.auth().listUsers(100);
    listUsersResult.users.forEach((user, index) => {
      const customClaims = user.customClaims || {};
      console.log(`   ${index + 1}. ${user.email} (${user.uid}) ${customClaims.admin ? '[ADMIN]' : ''}`);
    });

    console.log('\n✅ Authentication setup completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@atamagri.com / Admin@Atamagri2024!');
    console.log('   Test:  test@atamagri.com / Test@Atamagri2024!');

  } catch (error) {
    console.error('❌ Error setting up authentication:', error);
    process.exit(1);
  }
}

// Run the setup
setupAuth().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});