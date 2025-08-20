import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DashboardCard } from '../components/DashboardCards';
import MapEmbed from '../components/MapEmbed';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl font-bold text-primary-900 mb-8 text-center">Plant Monitoring Dashboard</h1>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <DashboardCard title="Temperature" value="27.2°C" color="bg-primary-700" />
            <DashboardCard title="Humidity" value="68%" color="bg-accent-yellow text-primary-900" />
            <DashboardCard title="Soil Moisture" value="45%" color="bg-primary-500" />
            <DashboardCard title="Light Intensity" value="1200 lx" color="bg-primary-900" />
          </div>
          {/* Map Section */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Drone & Station Map</h2>
            <MapEmbed />
          </div>
          {/* Placeholder for more dashboard features */}
          <div className="bg-white rounded-xl shadow p-8 text-primary-900 text-center">
            <h3 className="font-semibold text-lg mb-2">Latest Disease Detection</h3>
            <p className="text-primary-700">Late blight • Confidence 87.5% • Time: 2 days ago</p>
            <div className="flex gap-4 justify-center mt-6">
              <button className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-900 transition-colors">Launch Drone Control</button>
              <button className="bg-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-900 transition-colors">View Mission History</button>
              <button className="bg-accent-yellow text-primary-900 px-6 py-2 rounded-full font-semibold hover:bg-primary-500 transition-colors">Safety Settings</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
