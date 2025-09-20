
import React from 'react';
import MapEmbed from './MapEmbed';
import { DashboardCard } from './DashboardCards';
import DroneControl from './drone-control';

const DashboardMain: React.FC = () => (
  <div className="flex flex-col gap-8">
    {/* Ikhtisar Dashboard */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <DashboardCard title="Total Stasiun" value="12" color="bg-primary-700" />
      <DashboardCard title="Stasiun Aktif" value="10" color="bg-accent-yellow text-primary-900" />
      <DashboardCard title="Rata-rata Suhu" value="27.2°C" color="bg-primary-500" />
      <DashboardCard title="Rata-rata Kelembaban" value="68%" color="bg-primary-900" />
    </div>

    {/* Drone Operations - Integrasi DroneControl */}
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="font-serif text-xl font-bold text-primary-900 mb-4">Drone Operations</h2>
      <DroneControl />
    </div>

    {/* Data Penyakit Terakhir */}
    <div className="bg-white rounded-xl shadow p-8">
      <h3 className="font-semibold text-lg mb-2">Data Penyakit Terakhir</h3>
      {/* TODO: Integrasi data penyakit dari backend jika tersedia */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-primary-900">
          <thead>
            <tr>
              <th className="px-4 py-2">Tanaman</th>
              <th className="px-4 py-2">Kondisi</th>
              <th className="px-4 py-2">Confidence</th>
              <th className="px-4 py-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Kentang</td>
              <td className="px-4 py-2">Late blight</td>
              <td className="px-4 py-2">87.5%</td>
              <td className="px-4 py-2">2 hari lalu</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Tomat</td>
              <td className="px-4 py-2">Leaf spot</td>
              <td className="px-4 py-2">92.1%</td>
              <td className="px-4 py-2">1 hari lalu</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tombol aksi */}
      <div className="flex gap-4 justify-center mt-6">
        <button className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-900 transition-colors">Launch Drone</button>
        <button className="bg-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-900 transition-colors">View Mission History</button>
        <button className="bg-accent-yellow text-primary-900 px-6 py-2 rounded-full font-semibold hover:bg-primary-500 transition-colors">Safety Settings</button>
      </div>
    </div>

    {/* Stasiun Anda */}
    <div className="bg-white rounded-xl shadow p-8">
      <h3 className="font-semibold text-lg mb-4">Stasiun Anda</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-primary-900">
          <thead>
            <tr>
              <th className="px-4 py-2">Nama Stasiun</th>
              <th className="px-4 py-2">Suhu</th>
              <th className="px-4 py-2">Kelembaban</th>
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2">Station 1</td>
              <td className="px-4 py-2">27.1°C</td>
              <td className="px-4 py-2">67%</td>
              <td className="px-4 py-2">Colomadu</td>
              <td className="px-4 py-2 text-green-600 font-bold">Aktif</td>
              <td className="px-4 py-2">2 menit lalu</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Station 2</td>
              <td className="px-4 py-2">28.0°C</td>
              <td className="px-4 py-2">65%</td>
              <td className="px-4 py-2">Karanganyar</td>
              <td className="px-4 py-2 text-red-600 font-bold">Offline</td>
              <td className="px-4 py-2">10 menit lalu</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Peta distribusi stasiun */}
    <div>
      <h2 className="font-serif text-2xl font-bold text-primary-900 mb-4">Peta Distribusi Stasiun</h2>
      <MapEmbed src="https://www.google.com/maps?q=Daratan,+RT+2+RW+6,+Senden,+Tohudan,+Kecamatan+Colomadu,+Kabupaten+Karanganyar,+Jawa+Tengah&output=embed" height={350} />
    </div>
  </div>
);

export default DashboardMain;
