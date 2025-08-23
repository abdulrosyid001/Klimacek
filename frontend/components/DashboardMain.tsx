import React from 'react';
import MapEmbed from './MapEmbed';
import { DashboardCard } from './DashboardCards';

const DashboardMain: React.FC = () => (
  <div className="flex flex-col gap-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <DashboardCard title="Temperature" value="27.2°C" color="bg-primary-700" />
      <DashboardCard title="Humidity" value="68%" color="bg-accent-yellow text-primary-900" />
      <DashboardCard title="Soil Moisture" value="45%" color="bg-primary-500" />
      <DashboardCard title="Light Intensity" value="1200 lx" color="bg-primary-900" />
    </div>
    <div>
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Drone & Station Map</h2>
      <MapEmbed />
    </div>
    <div className="bg-white rounded-xl shadow p-8 text-primary-900 text-center">
      <h3 className="font-semibold text-lg mb-2">Latest Disease Detection</h3>
      <p className="text-primary-700">Late blight • Confidence 87.5% • Time: 2 days ago</p>
      <div className="flex gap-4 justify-center mt-6">
        <button className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-900 transition-colors">Launch Drone Control</button>
        <button className="bg-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-900 transition-colors">View Mission History</button>
        <button className="bg-accent-yellow text-primary-900 px-6 py-2 rounded-full font-semibold hover:bg-primary-500 transition-colors">Safety Settings</button>
      </div>
    </div>
  </div>
);

export default DashboardMain;
