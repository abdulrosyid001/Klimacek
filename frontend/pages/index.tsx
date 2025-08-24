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
import Marquee from '../components/Marquee';
import Carousel from '../components/Carousel';
import Solutions from '../components/Solutions';
import ExpertValidation from '../components/ExpertValidation';
import LatestPosts from '../components/LatestPosts';
import CheckoutMenu from '../components/CheckoutMenu';
import { products } from '../data/products';
import { testimonials } from '../data/testimonials';
import { BarChart2, Brain, Activity, ShieldCheck, Leaf, Tractor, CloudSun, Users } from 'lucide-react';

// Dummy data for new sections
const marqueeText = ['Agriculture', 'AI', 'IoT', 'Vegetables'];
const carouselImages = ['/images/farm1.jpg', '/images/farm2.jpg', '/images/farm3.jpg'];
const solutions = [
  { icon: <Leaf />, title: 'Smallholder Farms', description: 'Affordable solutions for small-scale farmers.' },
  { icon: <Tractor />, title: 'Commercial Farms', description: 'Scalable tech for large operations.' },
  { icon: <CloudSun />, title: 'Research & Education', description: 'Tools for agri-research and learning.' },
];
const experts = [
  { name: 'Dr. Siti Agrotech', title: 'AgriTech Expert', photo: '/images/expert1.jpg' },
  { name: 'Prof. Budi IoT', title: 'IoT Specialist', photo: '/images/expert2.jpg' },
];
const logos = ['/images/logo1.png', '/images/logo2.png', '/images/logo3.png'];
const posts = [
  { id: '1', title: 'How AI is Changing Farming', excerpt: 'Discover the impact of AI on modern agriculture...', image: '/images/post1.png', link: '#' },
  { id: '2', title: 'IoT for Smallholders', excerpt: 'Affordable IoT solutions for every farmer...', image: '/images/post2.png', link: '#' },
  { id: '3', title: 'Precision Agriculture', excerpt: 'Data-driven decisions for better yields...', image: '/images/post3.png', link: '#' },
];
const checkoutLinks = [
  { label: 'Buy Now', href: '/products' },
  { label: 'Contact Sales', href: '/contact' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>ATAMAGRI - Smart Agriculture Solutions</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* 1. Garis besar dari website */}
        <Hero />
        {/* 2. Menu "Contact Us" + gambar background tulisan */}
        <section className="relative w-full h-64 flex items-center justify-center text-center mb-8" style={{ backgroundImage: 'url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-primary-900/60" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">Contact Us Anytime</h2>
            <a href="/contact" className="inline-block mt-4 bg-primary-700 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-primary-900 transition-colors">Contact Us</a>
          </div>
        </section>
        {/* 3. Apa saja yang dapat dilakukan oleh produk saya */}
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard icon={Activity} title="Real-time Monitoring" description="Monitor your crops and environment 24/7 with live sensor data." />
          <FeatureCard icon={Brain} title="AI-Powered Insights" description="Get actionable recommendations powered by AI analytics." />
          <FeatureCard icon={BarChart2} title="Data Analytics" description="Visualize trends and make data-driven decisions for your farm." />
          <FeatureCard icon={ShieldCheck} title="100% Guaranteed" description="Reliable hardware and support for peace of mind." />
        </section>
        {/* 4. Keunggulan produk */}
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <FeatureCard icon={Users} title="Community Support" description="Join a growing network of smart farmers." />
          <FeatureCard icon={CloudSun} title="Weather Ready" description="Hyperlocal weather data for your farm." />
          <FeatureCard icon={Tractor} title="Easy Integration" description="Plug & play with existing systems." />
          <FeatureCard icon={Leaf} title="Eco Friendly" description="Sustainable and energy-efficient." />
        </section>
        {/* 5. Hiasan teks marquee */}
        <Marquee text={marqueeText} speed={30} direction="left" />
        {/* 6. Best Agriculture Services */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Best Agriculture Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard title="Atama Climate" description="Weather station for hyperlocal climate data." image="/images/product-sensor.png" />
            <ServiceCard title="Atama Vis" description="Drone system for aerial crop monitoring." image="/images/product-drone.png" />
            <ServiceCard title="Atama Sense" description="Farm dashboard for real-time insights." image="/images/product-laptop.png" />
          </div>
        </section>
        {/* 7. Solutions for Every Scale */}
        <Solutions items={solutions} />
        {/* 8. Gambar random pertanian bergeser otomatis (carousel) */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <Carousel images={carouselImages} interval={3500} />
        </section>
        {/* 9. What Our Customers Say (testimonials) */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">What Our Customers Say</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
        {/* 10. Partner & Incubation */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">Partner & Incubation</h2>
          <PartnerLogos />
        </section>
        {/* 11. Menu menuju "Checkout" */}
        <CheckoutMenu links={checkoutLinks} />
        {/* 12. Validated by Experts, Recognized by Industry */}
        <ExpertValidation experts={experts} logos={logos} />
        {/* 13. Latest Posts & Articles */}
        <LatestPosts posts={posts} />
        {/* 14. Footer */}
      </main>
      <Footer />
    </>
  );
}
