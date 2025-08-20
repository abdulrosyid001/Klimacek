import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import PricingCard from '../components/PricingCard';
import { products } from '../data/products';

export default function Products() {
  return (
    <>
      <Head>
        <title>Our Products - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-primary-900 mb-4">Our Products</h1>
          <p className="text-lg text-primary-700 mb-8">Explore our suite of digital and IoT solutions for modern agriculture. From real-time dashboards to robust weather stations and smart drones, we have you covered.</p>
        </section>
        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
        {/* Pricing Section */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <PricingCard title="Starter Package" price="$59" features={["Collect hyperlocal data 24/7","Lifetime access to Atama Sense","Monitor farm in real-time","AI-powered recommendations"]} accent="yellow" />
            <PricingCard title="Pro Package" price="$365" features={["Includes drone + Atama Sense + Atama Climate","Full dashboard access","Priority support"]} accent="green" best />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
