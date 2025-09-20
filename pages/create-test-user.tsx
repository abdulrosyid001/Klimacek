import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default function CreateTestUser() {
  const [email, setEmail] = useState('test@atamagri.app');
  const [password, setPassword] = useState('TestPassword123!');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | null; text: string }>({ type: null, text: '' });
  const auth = getAuth(app);

  const handleCreateUser = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage({
        type: 'success',
        text: `User created successfully! UID: ${userCredential.user.uid}`
      });

      // Clear form
      setEmail('');
      setPassword('');
    } catch (error: any) {
      let errorMessage = 'Failed to create user';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try a different email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred';
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const testUsers = [
    { email: 'admin@atamagri.app', password: 'AdminPass123!' },
    { email: 'test@atamagri.app', password: 'TestPass123!' },
    { email: 'demo@atamagri.app', password: 'DemoPass123!' }
  ];

  const quickFill = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Test User</CardTitle>
            <CardDescription>
              Create a new user account for testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@atamagri.app"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password123!"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            {message.type && (
              <Alert className={
                message.type === 'success' ? 'border-green-500' :
                message.type === 'error' ? 'border-red-500' :
                'border-blue-500'
              }>
                <div className="flex items-center gap-2">
                  {message.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {message.type === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                  {message.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                  <AlertDescription>{message.text}</AlertDescription>
                </div>
              </Alert>
            )}

            <Button
              onClick={handleCreateUser}
              disabled={isLoading || !email || !password}
              className="w-full"
            >
              {isLoading ? 'Creating User...' : 'Create User'}
            </Button>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Quick fill with test credentials:</p>
              <div className="space-y-2">
                {testUsers.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => quickFill(user.email, user.password)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    disabled={isLoading}
                  >
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-muted-foreground">Password: {user.password}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This page is for development/testing only.
                Remove or protect it in production.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}