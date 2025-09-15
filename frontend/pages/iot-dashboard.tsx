import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface SensorData {
  id: string;
  device_id: string;
  temperature?: number;
  humidity?: number;
  soil_moisture?: number;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  timestamp: any;
  received_at: string;
}

export default function IoTDashboard() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only run if Firebase is properly configured
    if (!db) {
      console.warn('Firebase not configured - unable to connect to database');
      setLoading(false);
      setConnected(false);
      return;
    }

    const sensorDataRef = ref(db, 'sensor_data');

    const unsubscribe = onValue(sensorDataRef, (snapshot) => {
      const data: SensorData[] = [];
      const val = snapshot.val();

      if (val) {
        Object.keys(val).forEach((key) => {
          data.push({
            id: key,
            ...val[key]
          } as SensorData);
        });

        // Sort by received_at descending
        data.sort((a, b) => {
          const timeA = new Date(a.received_at || 0).getTime();
          const timeB = new Date(b.received_at || 0).getTime();
          return timeB - timeA;
        });
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

  const getLatestByDevice = () => {
    const deviceMap = new Map();
    sensorData.forEach(data => {
      if (!deviceMap.has(data.device_id)) {
        deviceMap.set(data.device_id, data);
      }
    });
    return Array.from(deviceMap.values());
  };

  const formatValue = (value: number | undefined, unit: string) => {
    return value !== undefined ? `${value.toFixed(1)}${unit}` : 'N/A';
  };

  const getStatusColor = (received_at: string) => {
    if (!received_at) return 'bg-gray-500';

    const now = new Date().getTime();
    const dataTime = new Date(received_at).getTime();
    const diffMinutes = (now - dataTime) / (1000 * 60);

    if (diffMinutes < 2) return 'bg-green-500';
    if (diffMinutes < 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">IoT Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading sensor data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">IoT Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {sensorData.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No sensor data available</h2>
          <p className="text-gray-600 mb-4">
            Make sure your ESP32 is running and sending data to:
            <code className="bg-gray-100 px-2 py-1 rounded mx-2">/api/iot/sensor-data</code>
          </p>
          <p className="text-sm text-gray-500">
            Test dengan: <code>node test-iot-endpoint.js</code>
          </p>
        </div>
      ) : (
        <>
          {/* Latest Data from Each Device */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {getLatestByDevice().map((data) => (
              <Card key={data.device_id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{data.device_id}</CardTitle>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(data.received_at)}`}></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {data.received_at ? new Date(data.received_at).toLocaleString() : 'No timestamp'}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-red-600">🌡️ {formatValue(data.temperature, '°C')}</div>
                      <div className="font-medium text-blue-600">💧 {formatValue(data.humidity, '%')}</div>
                      <div className="font-medium text-brown-600">🌱 {formatValue(data.soil_moisture, '%')}</div>
                      <div className="font-medium text-purple-600">📊 pH {formatValue(data.ph, '')}</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">🔹 N: {formatValue(data.nitrogen, ' ppm')}</div>
                      <div className="font-medium text-orange-600">🔸 P: {formatValue(data.phosphorus, ' ppm')}</div>
                      <div className="font-medium text-yellow-600">🔹 K: {formatValue(data.potassium, ' ppm')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Data History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Device</th>
                      <th className="text-left p-2">Temp</th>
                      <th className="text-left p-2">Humidity</th>
                      <th className="text-left p-2">Soil</th>
                      <th className="text-left p-2">pH</th>
                      <th className="text-left p-2">N-P-K</th>
                      <th className="text-left p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorData.slice(0, 20).map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Badge variant="outline">{data.device_id}</Badge>
                        </td>
                        <td className="p-2">{formatValue(data.temperature, '°C')}</td>
                        <td className="p-2">{formatValue(data.humidity, '%')}</td>
                        <td className="p-2">{formatValue(data.soil_moisture, '%')}</td>
                        <td className="p-2">{formatValue(data.ph, '')}</td>
                        <td className="p-2">
                          {data.nitrogen && data.phosphorus && data.potassium
                            ? `${data.nitrogen.toFixed(0)}-${data.phosphorus.toFixed(0)}-${data.potassium.toFixed(0)}`
                            : 'N/A'
                          }
                        </td>
                        <td className="p-2 text-gray-500">
                          {data.received_at ? new Date(data.received_at).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}