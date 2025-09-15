# Vercel Deployment Setup

## Firebase Environment Variables

To deploy this application on Vercel, you need to configure the following environment variables in your Vercel project dashboard:

### Required Environment Variables

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
IOT_SECRET=your-iot-secret-key
```

### How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Select your web app or create a new one
6. Copy the configuration values

### Vercel Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy

## Build Configuration

The application is configured to handle missing Firebase environment variables during build time gracefully. If Firebase is not configured:

- The build will succeed
- The IoT dashboard will show a configuration warning
- The API endpoint will return a "service unavailable" error

This allows the build to pass even if environment variables are not set initially.

## Local Development

For local development, copy `.env.local.example` to `.env.local` and fill in your Firebase configuration values.