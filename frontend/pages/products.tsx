import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductHero from '../components/ProductHero';
import ProductPackage from '../components/ProductPackage';
import { products } from '../data/products';

const packages = [
  {
    title: 'Starter Package',
    price: '$59',
    features: [
      'Collect hyperlocal data 24/7',
      'Lifetime access to Atama Sense',
      'Monitor farm in real-time',
      'AI-powered recommendations',
    ],
    accent: 'yellow',
    image: '/images/starter-package.png',
  },
  {
    title: 'Pro Package',
    price: '$365',
    features: [
      'Includes drone + Atama Sense + Atama Climate',
      'Full dashboard access',
      'Priority support',
    ],
    accent: 'green',
    best: true,
    image: '/images/pro-package.png',
  },
];

export default function Products() {
  return (
    <>
      <Head>
        <title>Our Products - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* 1. Tulisan "Our Product" + background tulisan */}
  <ProductHero title="Our Product" backgroundImage="/images/products-bg.png" subtitle="Digital & IoT Solutions for Modern Agriculture" subtitleClassName="text-white" />
        {/* 2. Daftar produk yang dijual */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
        {/* 2.5. Sensor Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Sensor List */}
            {[
              {
                name: 'Sensor Curah Hujan',
                image: '/images/sensor_curah_hujan-removebg-preview.png',
                link: 'https://www.tokopedia.com/evoteknologi/evoteknologi-sensor-curah-hujan-ombrometer-tipping-bucket-rain-gauge-kotak-1731404751579350692/review',
              },
              {
                name: 'Sensor Kecepatan Angin',
                image: null,
                link: 'https://www.tokopedia.com/evoteknologi/evoteknologi-sensor-kecepatan-angin-anemometer-wind-speed-support-arduino-1731404691734431396?extParam=ivf%3Dfalse%26keyword%3Dsensor+anemometer%26search_id%3D2025070811370311B9842E0A271F123K4W%26src%3Dsearch',
              },
              {
                name: 'Sensor Suhu dan Kelembapan',
                image: '/images/sensor_suhu_dan_kelembapan-removebg-preview.png',
                link: null,
              },
              {
                name: 'Sensor Lain 1',
                image: null,
                link: null,
              },
              {
                name: 'Sensor Lain 2',
                image: null,
                link: null,
              },
            ].map((sensor, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 min-h-[260px] justify-between"
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  {sensor.image ? (
                    <img
                      src={sensor.image}
                      alt={sensor.name}
                      className="h-20 mb-2 object-contain"
                    />
                  ) : (
                    <div className="h-20 w-full flex items-center justify-center bg-gray-100 text-gray-400 mb-2 rounded">
                      No Image
                    </div>
                  )}
                  <div className="font-semibold text-center mb-4">{sensor.name}</div>
                </div>
                {sensor.link ? (
                  <a
                    href={sensor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-3 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition text-sm font-medium"
                  >
                    Beli di Tokopedia
                  </a>
                ) : (
                  <button
                    className="mt-2 px-3 py-2 bg-gray-300 text-gray-500 rounded shadow text-sm font-medium cursor-not-allowed"
                    disabled
                  >
                    Beli di Tokopedia
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
        {/* 3. Our Product Package */}
        <ProductPackage packages={packages} />
        {/* 4. Footer */}
      </main>
      <Footer />
    </>
  );
}