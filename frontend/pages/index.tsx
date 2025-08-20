import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import PricingCard from '../components/PricingCard';
import TestimonialCard from '../components/TestimonialCard';
import PartnerLogos from '../components/PartnerLogos';
import StatsBox from '../components/StatsBox';
import { products } from '../data/products';
import { testimonials } from '../data/testimonials';

import { BarChart2, Brain, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head>
        <title>ATAMAGRI - Smart Agriculture Solutions</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        <Hero />
        {/* Features Row */}
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard icon={Activity} title="Real-time Monitoring" description="Monitor your crops and environment 24/7 with live sensor data." />
          <FeatureCard icon={Brain} title="AI-Powered Insights" description="Get actionable recommendations powered by AI analytics." />
          <FeatureCard icon={BarChart2} title="Data Analytics" description="Visualize trends and make data-driven decisions for your farm." />
          <FeatureCard icon={ShieldCheck} title="100% Guaranteed" description="Reliable hardware and support for peace of mind." />
        </section>
        {/* Services */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Best Agriculture Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard title="Atama Climate" description="Weather station for hyperlocal climate data." image="/images/product-sensor.png" />
            <ServiceCard title="Atama Vis" description="Drone system for aerial crop monitoring." image="/images/product-drone.png" />
            <ServiceCard title="Atama Sense" description="Farm dashboard for real-time insights." image="/images/product-laptop.png" />
          </div>
        </section>
        {/* Product Showcase */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <a href="/products" className="bg-primary-700 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-primary-900 transition-colors focus:outline focus:ring-2 focus:ring-primary-700">
              View All Products
            </a>
          </div>
        </section>
        {/* Pricing */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <PricingCard title="Starter Package" price="$59" features={["Collect hyperlocal data 24/7","Lifetime access to Atama Sense","Monitor farm in real-time","AI-powered recommendations"]} accent="yellow" />
            <PricingCard title="Pro Package" price="$365" features={["Includes drone + Atama Sense + Atama Climate","Full dashboard access","Priority support"]} accent="green" best />
          </div>
        </section>
        {/* Stats Row */}
        <section className="max-w-5xl mx-auto px-4 py-10 flex flex-wrap gap-6 justify-center">
          <StatsBox label="Total Users" value={1200} accent="green" />
          <StatsBox label="Active Stations" value={18} accent="yellow" />
          <StatsBox label="Avg. Temp (°C)" value={27.2} accent="green" />
          <StatsBox label="Avg. Humidity (%)" value={68} accent="yellow" />
        </section>
        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">What Our Clients Say</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
        {/* Partners */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">Our Partners</h2>
          <PartnerLogos />
        </section>
      </main>
      <Footer />
    </>
  );
}
