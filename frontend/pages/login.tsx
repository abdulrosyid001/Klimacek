import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check for message in query params
    if (router.query.message) {
      setMessage(router.query.message as string);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Execute reCAPTCHA
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.enterprise) {
        try {
          recaptchaToken = await window.grecaptcha.enterprise.execute('6LeNbc4rAAAAAF6TytlsbsacAAcw_B69AoSi3QNU', {
            action: 'LOGIN'
          });
          console.log('reCAPTCHA token obtained successfully');

          // For static export, we skip server-side verification
          // In production, you should implement this verification on a separate backend service

          // Store token for potential future use
          sessionStorage.setItem('recaptcha_token', recaptchaToken);
          sessionStorage.setItem('recaptcha_timestamp', Date.now().toString());
        } catch (recaptchaError: any) {
          console.error('reCAPTCHA error:', recaptchaError);
          // Continue without reCAPTCHA verification for now
          console.warn('Continuing without reCAPTCHA verification');
        }
      } else {
        console.warn('reCAPTCHA not loaded - continuing without it');
        // Continue without reCAPTCHA for static export
      }

      // Proceed with sign in
      await signIn(formData.email, formData.password);

      // Log successful login with reCAPTCHA info
      if (recaptchaToken) {
        console.log('Login successful with reCAPTCHA protection');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('User not found. Please contact admin to create an account.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(error.message || 'An error occurred during sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome to ATAMAGRI</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 rounded"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Need an account?</strong> Please contact your administrator to create an account for you.
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Email: <a href="mailto:atamagriacc@gmail.com" className="font-semibold underline hover:text-blue-900">
                  atamagriacc@gmail.com
                </a>
              </p>
            </div>
            <div className="mt-4 text-center text-xs text-gray-500">
              This site is protected by reCAPTCHA Enterprise and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                Terms of Service
              </a>{' '}
              apply.
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}