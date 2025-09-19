import React, { useState, useEffect } from 'react';
import { Home, Plane, Settings, LogOut, Shield, Plus, CloudRain, Wind, Sun, Thermometer, Droplets, Battery, Activity, RefreshCw, MapPin, Wifi, WifiOff, Edit2, Trash2, Save, X, User, Mail, Phone, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/auth-context';
import { db } from '../lib/firebase';
import { ref, onValue, query, limitToLast, set, remove, push } from 'firebase/database';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import dynamic from 'next/dynamic';
import PuzzleVerification from '../components/PuzzleVerification';

const DroneControl = dynamic(() => import('../components/drone-control'), {
  ssr: false
});

interface Station {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  lastUpdate?: string;
}

interface SensorData {
  id: string;
  device_id: string;
  timestamp: string;
  wind_m_s?: number;
  wind_kmh?: number;
  rainrate_mm_h?: number;
  temperature_C?: number;
  humidity_?: number;
  light_lux?: number;
  sol_voltage_V?: number;
  sol_current_mA?: number;
  sol_power_W?: number;
  received_at?: string;
}

export default function Dashboard() {
  const { logout, isAdmin, user } = useAuth();
  const [active, setActive] = useState<string>('dashboard');
  const router = useRouter();
  const [puzzleVerified, setPuzzleVerified] = useState(false);

  // Station management
  const [stations, setStations] = useState<Station[]>([]);
  const [showAddStation, setShowAddStation] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [newStation, setNewStation] = useState({ name: '', location: '' });

  // Sensor data
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // User settings
  const [userProfile, setUserProfile] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load stations from Firebase
  useEffect(() => {
    if (!db) return;

    const stationsRef = ref(db, 'stations');
    const unsubscribe = onValue(stationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stationsList: Station[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setStations(stationsList);
      } else {
        // Default stations if none exist
        setStations([
          { id: 'north-field', name: 'North Field', location: 'Field A1', status: 'active' },
          { id: 'south-orchard', name: 'South Orchard', location: 'Orchard B2', status: 'active' },
          { id: 'west-plot', name: 'West Plot', location: 'Plot C3', status: 'inactive' }
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load sensor data
  useEffect(() => {
    if (!db) {
      console.warn('Firebase database not initialized');
      // Set default data when DB is not available
      setSensorData([
        {
          id: 'demo1',
          device_id: 'north-field',
          timestamp: new Date().toISOString(),
          temperature_C: 25.5,
          humidity_: 65,
          wind_kmh: 12.3,
          rainrate_mm_h: 0,
          light_lux: 45000,
          sol_voltage_V: 12.5,
          sol_current_mA: 850,
          sol_power_W: 10.6,
          received_at: new Date().toISOString()
        }
      ]);
      setLoading(false);
      setConnected(false);
      return;
    }

    const sensorDataRef = ref(db, 'sensor_data');
    const recentQuery = query(sensorDataRef, limitToLast(100));

    const unsubscribe = onValue(recentQuery, (snapshot) => {
      const data: SensorData[] = [];
      const val = snapshot.val();

      if (val) {
        Object.keys(val).forEach((key) => {
          data.push({
            id: key,
            ...val[key]
          } as SensorData);
        });

        data.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.received_at || 0).getTime();
          const timeB = new Date(b.timestamp || b.received_at || 0).getTime();
          return timeB - timeA;
        });

        setLastUpdate(new Date());
      }

      setSensorData(data);
      setLoading(false);
      setConnected(true);
    }, (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
      setConnected(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddStation = async () => {
    if (!newStation.name || !newStation.location) return;

    const station: Station = {
      id: newStation.name.toLowerCase().replace(/\s+/g, '-'),
      name: newStation.name,
      location: newStation.location,
      status: 'inactive',
      lastUpdate: new Date().toISOString()
    };

    if (db) {
      const stationsRef = ref(db, `stations/${station.id}`);
      await set(stationsRef, station);
    }

    setStations([...stations, station]);
    setNewStation({ name: '', location: '' });
    setShowAddStation(false);
  };

  const handleDeleteStation = async (stationId: string) => {
    if (db) {
      const stationRef = ref(db, `stations/${stationId}`);
      await remove(stationRef);
    }
    setStations(stations.filter(s => s.id !== stationId));
  };

  const handleUpdateStation = async (station: Station) => {
    if (db) {
      const stationRef = ref(db, `stations/${station.id}`);
      await set(stationRef, station);
    }
    setStations(stations.map(s => s.id === station.id ? station : s));
    setEditingStation(null);
  };

  const handleSaveSettings = () => {
    // Here you would typically update the user profile in Firebase
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const getLatestData = (stationId?: string) => {
    if (stationId) {
      return sensorData.find(d => d.device_id === stationId) || sensorData[0];
    }
    return sensorData[0];
  };

  const getChartData = (stationId?: string) => {
    const filteredData = stationId
      ? sensorData.filter(d => d.device_id === stationId)
      : sensorData;

    return filteredData
      .slice(0, 24)
      .reverse()
      .map(d => ({
        time: new Date(d.timestamp || d.received_at || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: d.temperature_C,
        humidity: d.humidity_,
        wind: d.wind_kmh,
        rain: d.rainrate_mm_h
      }));
  };

  const renderContent = () => {
    switch(active) {
      case 'dashboard':
        const latestData = getLatestData();
        const chartData = getChartData();

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Farm Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Stations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stations.filter(s => s.status === 'active').length}</div>
                    <p className="text-xs text-gray-500">of {stations.length} total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-red-500" />
                      {latestData?.temperature_C?.toFixed(1) || '--'}°C
                    </div>
                    <p className="text-xs text-gray-500">Current reading</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      {latestData?.humidity_?.toFixed(0) || '--'}%
                    </div>
                    <p className="text-xs text-gray-500">Current level</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Wind Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      <Wind className="w-5 h-5 text-gray-500" />
                      {latestData?.wind_kmh?.toFixed(1) || '--'} km/h
                    </div>
                    <p className="text-xs text-gray-500">Current speed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Weather Chart */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Weather Trends (24 Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                      <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Station Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {stations.map(station => (
                  <Card key={station.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{station.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {station.location}
                          </CardDescription>
                        </div>
                        <Badge variant={station.status === 'active' ? 'default' : 'secondary'}>
                          {station.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {station.status === 'active' ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {station.status === 'active' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActive(station.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'drone':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Drone Control Center</h2>
              <DroneControl />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Settings</h2>

              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Profile Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={userProfile.displayName}
                        onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        placeholder="+62 xxx-xxxx-xxxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={userProfile.newPassword}
                        onChange={(e) => setUserProfile({...userProfile, newPassword: e.target.value})}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={userProfile.confirmPassword}
                        onChange={(e) => setUserProfile({...userProfile, confirmPassword: e.target.value})}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  {settingsSaved && (
                    <p className="text-green-600 flex items-center">
                      Settings saved successfully!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // Individual station view
        const station = stations.find(s => s.id === active);
        if (station) {
          const stationData = getLatestData(station.id);
          const stationChartData = getChartData(station.id);

          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{station.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {station.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStation(station)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStation(station.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Station Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stationData?.temperature_C?.toFixed(1) || '--'}°C</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Humidity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stationData?.humidity_?.toFixed(0) || '--'}%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Wind Speed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stationData?.wind_kmh?.toFixed(1) || '--'} km/h</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Rain Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stationData?.rainrate_mm_h?.toFixed(1) || '--'} mm/h</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Station Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Station Data Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={stationChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="temperature" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Temperature (°C)" />
                        <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Humidity (%)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        }

        // Add Station View
        if (active === 'add-station') {
          return (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Weather Station</h2>

                <div className="max-w-md space-y-4">
                  <div>
                    <Label htmlFor="station-name">Station Name</Label>
                    <Input
                      id="station-name"
                      value={newStation.name}
                      onChange={(e) => setNewStation({...newStation, name: e.target.value})}
                      placeholder="e.g., East Greenhouse"
                    />
                  </div>

                  <div>
                    <Label htmlFor="station-location">Location</Label>
                    <Input
                      id="station-location"
                      value={newStation.location}
                      onChange={(e) => setNewStation({...newStation, location: e.target.value})}
                      placeholder="e.g., Greenhouse Block D4"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleAddStation} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Station
                    </Button>
                    <Button variant="outline" onClick={() => setActive('dashboard')}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
    }
  };

  if (!puzzleVerified) {
    return (
      <ProtectedRoute>
        <PuzzleVerification onSuccess={() => setPuzzleVerified(true)} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-neutral-50">
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="h-full w-64 bg-[#2ecc71] border-r border-green-300 shadow-md flex flex-col py-6 px-4">
            <div className="mb-6 flex justify-start items-center pl-1">
              <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${
                  active === 'dashboard' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => setActive('dashboard')}
              >
                <Home className="w-5 h-5" />
                <span className="truncate font-normal">Dashboard</span>
              </button>

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${
                  active === 'drone' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => setActive('drone')}
              >
                <Plane className="w-5 h-5" />
                <span className="truncate font-normal">Drone Control</span>
              </button>

              <div className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-green-100">Stasiun Cuaca</div>

              {stations.map((station) => (
                <button
                  key={station.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left ${
                    active === station.id ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                  }`}
                  onClick={() => setActive(station.id)}
                >
                  <span className={`w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                  <span className="truncate font-normal">{station.name}</span>
                </button>
              ))}

              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left mt-3 ${
                  active === 'add-station' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
                }`}
                onClick={() => setActive('add-station')}
              >
                <Plus className="w-5 h-5" />
                <span className="truncate font-normal">Tambah Stasiun</span>
              </button>
            </nav>

            {isAdmin && (
              <button
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 hover:bg-yellow-100 text-yellow-800 mt-6 text-left"
                onClick={() => router.push('/admin')}
              >
                <Shield className="w-5 h-5" />
                <span className="truncate font-normal">Admin Panel</span>
              </button>
            )}

            <button
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left mt-2 ${
                active === 'settings' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'
              }`}
              onClick={() => setActive('settings')}
            >
              <Settings className="w-5 h-5" />
              <span className="truncate font-normal">User Settings</span>
            </button>

            <button
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 hover:bg-red-100 text-red-800 mt-2 text-left"
              onClick={() => logout()}
            >
              <LogOut className="w-5 h-5" />
              <span className="truncate font-normal">Logout</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 md:p-12 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-xl">Loading dashboard data...</div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>

        {/* Edit Station Modal */}
        {editingStation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Edit Station</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Station Name</Label>
                  <Input
                    id="edit-name"
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingStation.location}
                    onChange={(e) => setEditingStation({...editingStation, location: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="w-full border rounded-md p-2"
                    value={editingStation.status}
                    onChange={(e) => setEditingStation({...editingStation, status: e.target.value as 'active' | 'inactive'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={() => handleUpdateStation(editingStation)} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingStation(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}