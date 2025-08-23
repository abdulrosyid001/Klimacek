import React from 'react';
// You can replace this with Chart.js or Recharts for real data

const WeatherStation: React.FC = () => (
  <div className="flex flex-col gap-8">
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Sensor Data</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-xl bg-primary-100 p-4 text-center">
          <div className="font-bold text-lg">Temperature</div>
          <div className="text-2xl text-primary-700">27.2°C</div>
        </div>
        <div className="rounded-xl bg-primary-100 p-4 text-center">
          <div className="font-bold text-lg">Humidity</div>
          <div className="text-2xl text-primary-700">68%</div>
        </div>
        <div className="rounded-xl bg-primary-100 p-4 text-center">
          <div className="font-bold text-lg">Soil Moisture</div>
          <div className="text-2xl text-primary-700">45%</div>
        </div>
        <div className="rounded-xl bg-primary-100 p-4 text-center">
          <div className="font-bold text-lg">Light Intensity</div>
          <div className="text-2xl text-primary-700">1200 lx</div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Realtime Sensor Graph</h2>
      <div className="h-64 flex items-center justify-center text-primary-700">[Realtime Chart Placeholder]</div>
    </div>
  </div>
);

export default WeatherStation;
