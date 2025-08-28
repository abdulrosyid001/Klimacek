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
        {/* 3. Our Product Package */}
        <ProductPackage packages={packages} />
        {/* 4. Footer */}
      </main>
      <Footer />
    </>
  );
}
