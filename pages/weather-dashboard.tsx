import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../components/ProtectedRoute';

const DroneControl = dynamic(() => import('../components/drone-control'), {
  ssr: false
});
import {
  CloudRain,
  Wind,
  Sun,
  Thermometer,
  Droplets,
  Battery,
  TrendingUp,
  Activity,
  RefreshCw,
  Plane,
  Radio,
  Target,
  CircuitBoard,
  Home,
  ArrowLeft
} from 'lucide-react';

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

export default function WeatherDashboard() {
  const router = useRouter();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [selectedStation, setSelectedStation] = useState('ESP32-001');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showDroneControl, setShowDroneControl] = useState(false);
  const [droneData, setDroneData] = useState({
    status: 'offline',
    battery: 0,
    signal: 0,
    diseaseDetections: 0,
    areasScanned: '0 ha',
    lastDetection: null as null | {
      plant: string;
      condition: string;
      confidence: number;
      timestamp: string;
    }
  });

  useEffect(() => {
    if (!db) {
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

  const getLatestData = () => {
    return sensorData.find(d => d.device_id === selectedStation) || sensorData[0];
  };

  const getChartData = () => {
    return sensorData
      .filter(d => d.device_id === selectedStation)
      .slice(0, 24)
      .reverse()
      .map(d => ({
        time: new Date(d.timestamp || d.received_at || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temperature: d.temperature_C,
        humidity: d.humidity_,
        light: d.light_lux ? d.light_lux / 10 : 0,
        wind: d.wind_kmh,
        rain: d.rainrate_mm_h,
        power: d.sol_power_W
      }));
  };

  const latestData = getLatestData();
  const chartData = getChartData();

  const getSensorStatus = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) return 'OFFLINE';
    if (value < min || value > max) return 'WARNING';
    return 'NORMAL';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NORMAL': return 'text-green-600';
      case 'WARNING': return 'text-yellow-600';
      case 'OFFLINE': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="flex items-center justify-center h-screen">
            <div className="text-xl">Loading weather data...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Weather Station Dashboard</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">Location: Solo</span>
                </div>
                <span className="text-sm text-gray-500">• Last updated: {lastUpdate ? `${Math.floor((new Date().getTime() - lastUpdate.getTime()) / 60000)} minutes ago` : 'Never'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Sensors Status</div>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">8/8</div>
              <div className="text-xs text-green-600">Sensors Normal</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Uptime</div>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">99.2%</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Update Interval</div>
                <Activity className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">30</div>
              <div className="text-xs text-gray-600">seconds</div>
            </CardContent>
          </Card>
        </div>


        {/* Drone Control Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plane className="w-6 h-6 text-purple-600" />
                <span>Drone Operations</span>
              </div>
              <Badge className={droneData.status === 'connected' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                {droneData.status === 'connected' ? 'Online' : 'Offline'}
              </Badge>
            </CardTitle>
            <CardDescription>AI-powered agricultural surveillance and disease detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Battery className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Battery</p>
                <p className="text-lg font-bold text-gray-900">{droneData.battery}%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Radio className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Signal</p>
                <p className="text-lg font-bold text-gray-900">{droneData.signal}%</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Detections</p>
                <p className="text-lg font-bold text-gray-900">{droneData.diseaseDetections}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <CircuitBoard className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Area Scanned</p>
                <p className="text-lg font-bold text-gray-900">{droneData.areasScanned}</p>
              </div>
            </div>

            {droneData.lastDetection && (
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Latest Disease Detection</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Plant:</span>
                    <span className="ml-1 font-medium">{droneData.lastDetection.plant}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <span className="ml-1 font-medium text-orange-600">{droneData.lastDetection.condition}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Confidence:</span>
                    <span className="ml-1 font-medium">{droneData.lastDetection.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="ml-1 font-medium">{droneData.lastDetection.timestamp}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowDroneControl(!showDroneControl)}
              >
                <Plane className="w-4 h-4 mr-2" />
                {showDroneControl ? 'Hide' : 'Launch'} Drone Control
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Drone Control Interface */}
        {showDroneControl && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="w-5 h-5" />
                <span>Live Drone Control</span>
              </CardTitle>
              <CardDescription>Real-time drone operation and disease detection</CardDescription>
            </CardHeader>
            <CardContent>
              <DroneControl />
            </CardContent>
          </Card>
        )}

        {/* Main Sensor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperature</span>
                <Thermometer className="w-5 h-5 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.temperature_C?.toFixed(1) || '0.0'} °C
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.temperature_C, 0, 50))}`}>
                Status: {getSensorStatus(latestData?.temperature_C, 0, 50)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Kelembapan</span>
                <Droplets className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.humidity_?.toFixed(1) || '0.0'} RH
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.humidity_, 20, 80))}`}>
                Status: {getSensorStatus(latestData?.humidity_, 20, 80)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Intensitas Cahaya</span>
                <Sun className="w-5 h-5 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.light_lux?.toFixed(2) || '0.00'} Lux
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.light_lux, 0, 100000))}`}>
                Status: {getSensorStatus(latestData?.light_lux, 0, 100000)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Arus Solar Cell</span>
                <Battery className="w-5 h-5 text-orange-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.sol_current_mA?.toFixed(1) || '0.0'} mA
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.sol_current_mA, -1000, 1000))}`}>
                Status: {getSensorStatus(latestData?.sol_current_mA, -1000, 1000)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Tegangan Solar</span>
                <Battery className="w-5 h-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.sol_voltage_V?.toFixed(2) || '0.00'} mV
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.sol_voltage_V, 0, 20))}`}>
                Status: {getSensorStatus(latestData?.sol_voltage_V, 0, 20)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Watt Solar Cell</span>
                <Sun className="w-5 h-5 text-green-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.sol_power_W?.toFixed(0) || '0'} mW
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.sol_power_W, 0, 100))}`}>
                Status: {getSensorStatus(latestData?.sol_power_W, 0, 100)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Wind</span>
                <Wind className="w-5 h-5 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {((latestData?.wind_kmh || 0) / 1.852).toFixed(0)} Knot
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.wind_kmh, 0, 100))}`}>
                Status: {getSensorStatus(latestData?.wind_kmh, 0, 100)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Rain Gauge</span>
                <CloudRain className="w-5 h-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {latestData?.rainrate_mm_h?.toFixed(0) || '0'} mm
              </div>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(getSensorStatus(latestData?.rainrate_mm_h, 0, 100))}`}>
                Status: {getSensorStatus(latestData?.rainrate_mm_h, 0, 100)}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Temperature Trend</CardTitle>
              <Badge variant="secondary">Realtime</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="temperature" stroke="#ef4444" fill="#fecaca" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Humidity Trend</CardTitle>
              <Badge variant="secondary">Realtime</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#bfdbfe" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Copyright © 2025 Atamagri. All rights reserved.</p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}