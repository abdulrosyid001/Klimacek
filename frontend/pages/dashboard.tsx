import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import DashboardMain from '../components/DashboardMain';
import DroneControl from '../components/drone-control';
import WeatherStation from '../components/WeatherStation';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [menu, setMenu] = useState<'dashboard' | 'drone' | 'weather'>('dashboard');
  return (
    <>
      <Head>
        <title>Dashboard - ATAMAGRI</title>
      </Head>
      <div className="bg-beige min-h-screen flex flex-col">
        <div className="flex flex-1 min-h-0">
          {/* Sidebar Navigation */}
          <Sidebar active={menu} onNavigate={setMenu} />
          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {menu === 'dashboard' && <DashboardMain />}
            {menu === 'drone' && <DroneControl />}
            {menu === 'weather' && <WeatherStation />}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
