import React, { useState, useEffect } from 'react';
import AdminRoute from '../components/AdminRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { UserPlus, Users, Shield, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { db } from '../lib/firebase';

interface UserData {
  email: string;
  createdAt: string;
  createdBy: string;
  role: string;
}

export default function Admin() {
  const { user, logout, createUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('register');
  const [users, setUsers] = useState<UserData[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch registered users from Firebase Realtime Database
  useEffect(() => {
    if (db) {
      const usersRef = ref(db, 'registeredUsers');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.entries(data).map(([key, value]: [string, any]) => ({
            ...value,
            id: key
          }));
          setUsers(usersArray);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await createUser(formData.email, formData.password);

      // Save user info to database
      if (db && user) {
        const userRef = ref(db, `registeredUsers/${formData.email.replace(/\./g, '_')}`);
        await set(userRef, {
          email: formData.email,
          createdAt: new Date().toISOString(),
          createdBy: user.email,
          role: 'user'
        });
      }

      setSuccess(`User ${formData.email} created successfully!`);
      setFormData({ email: '', password: '', confirmPassword: '' });

      // Note: Admin will need to re-login due to Firebase limitation
      setTimeout(() => {
        setSuccess('User created! You need to sign in again for security.');
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(error.message || 'Failed to create user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Admin Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-[#2ecc71]" />
                <div>
                  <h1 className="text-3xl font-bold">Admin Panel</h1>
                  <p className="text-gray-600">Manage users and access control</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Current Admin Info */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Admin Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Logged in as: <span className="font-semibold">{user?.email}</span>
                </p>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Create new users and manage existing accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="register" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Register User
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Registered Users
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegisterUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
                          {success}
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
                            Creating User...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Register New User
                          </span>
                        )}
                      </Button>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> After creating a user, you will need to sign in again.
                          This is a security limitation when creating users from the client side.
                        </p>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="users" className="space-y-4">
                    <div className="rounded-lg border">
                      <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-semibold">Registered Users</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Total users: {users.length}
                        </p>
                      </div>
                      <div className="divide-y">
                        {users.length > 0 ? (
                          users.map((userData, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{userData.email}</p>
                                  <p className="text-sm text-gray-500">
                                    Registered on: {new Date(userData.createdAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Created by: {userData.createdBy}
                                  </p>
                                </div>
                                <div className="text-sm">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                    {userData.role || 'user'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No registered users yet
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Admin Account:</strong> admin@atamagri.com
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Only this account can access the admin panel and create new users.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </AdminRoute>
  );
}