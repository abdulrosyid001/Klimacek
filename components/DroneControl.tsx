import React from 'react';

const DroneControl: React.FC = () => (
  <div className="flex flex-col gap-8">
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Connected Drone</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img src="/images/drone-live.jpg" alt="Drone Live" className="rounded-xl w-80 h-56 object-cover shadow" />
        <div>
          <div className="font-bold text-lg mb-2">Drone ATAMA-VIS 01</div>
          <div className="text-primary-700 mb-2">Status: <span className="text-green-600 font-semibold">Active</span></div>
          <div className="text-primary-700">Battery: 87%</div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Detection Reports</h2>
      <ul className="list-disc list-inside text-primary-900">
        <li>Late blight detected • Confidence 87.5% • 2 days ago</li>
        <li>No new threats detected • 1 day ago</li>
      </ul>
    </div>
  </div>
);

export default DroneControl;
