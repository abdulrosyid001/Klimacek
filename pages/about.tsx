import BestAgriculture from '../components/BestAgriculture';
import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsBox from '../components/StatsBox';
import PartnerLogos from '../components/PartnerLogos';
import TestimonialCard from '../components/TestimonialCard';
import Marquee from '../components/Marquee';
import ExpertValidation from '../components/ExpertValidation';
import AboutHero from '../components/AboutHero';
import AgricultureMatters from '../components/AgricultureMatters';
import { testimonials } from '../data/testimonials';


const marqueeText = ['Agriculture', 'AI', 'IoT', 'Vegetables'];
const awards = [
  { photo: '/images/award1.png', position: '1st Place', competition: 'elevAte Indonesia Hackathon' },
  { photo: '/images/award2.png', position: '1st Place', competition: 'International Walisongo Competition' },
  { photo: '/images/award3.png', position: '1st Place', competition: 'Creativity and Innovation Competition (KRENOVA)' },
  { photo: '/images/award4.png', position: 'Finalist', competition: 'Indonesia AI Innovation Challenge' },
  { photo: '/images/award5.png', position: 'Finalist', competition: 'SMESTA x KemenKop UKM' },
  { photo: '/images/award6.png', position: 'Top 5', competition: 'TDC Business Competition' },
  { photo: '/images/award7.png', position: 'Top 30', competition: 'Pertamuda (Pertamina Young Entrepreneurs)' },
  { photo: '/images/award8.png', position: 'etc.', competition: '' },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        {/* 1. Tulisan "About Us" + gambar background tulisan */}
        <AboutHero title="About Us" backgroundImage="/images/about-bg.png" subtitle="Empowering Agriculture with Technology" />
        {/* 2. Keunggulan produk */}
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsBox label="Productivity Increase" value="70%" accent="yellow" />
          <StatsBox label="Years Experience" value={6} accent="green" />
          <StatsBox label="Awards" value={5} accent="yellow" />
          <StatsBox label="Happy Clients" value={1200} accent="green" />
        </section>
        {/* 3. Hiasan teks marquee */}
        <Marquee text={marqueeText} speed={30} direction="left" />
  {/* 4. Best Agriculture Services */}
  <BestAgriculture />
        {/* 5. Agriculture Matters to the Future of Development */}
        <AgricultureMatters
          title="Agriculture Matters to the Future of Development"
          description="We believe agriculture is the backbone of sustainable development. Our solutions are designed to empower farmers, researchers, and agribusinesses to achieve more with less, using the latest in AI and IoT."
          image="/images/agriculture-matters.png"
        />
        {/* 6. Validated by Experts, Recognized by Industry */}
        <ExpertValidation awards={awards} />
        {/* 7. What Our Customers Say (testimonials) */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">What Our Customers Say</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
        {/* 8. Footer */}
      </main>
      <Footer />
    </>
  );
}
