import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatsBox from '../components/StatsBox';
import PartnerLogos from '../components/PartnerLogos';
import TestimonialCard from '../components/TestimonialCard';
import { testimonials } from '../data/testimonials';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-primary-900 mb-4">About ATAMAGRI</h1>
          <p className="text-lg text-primary-700 mb-6">We are a passionate team dedicated to transforming agriculture with technology. Our mission is to empower farmers and agribusinesses with real-time data, AI insights, and reliable IoT solutions for a sustainable future.</p>
          <div className="flex flex-wrap gap-6 justify-center mb-8">
            <StatsBox label="Productivity Increase" value="70%" accent="yellow" />
            <StatsBox label="Years Experience" value={6} accent="green" />
            <StatsBox label="Awards" value={5} accent="yellow" />
          </div>
        </section>
        {/* Team Section */}
        <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img src="/images/team-photo.jpg" alt="ATAMAGRI Team" className="rounded-2xl shadow-lg w-80 h-80 object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary-900 mb-3">Our Team</h2>
            <p className="text-primary-700 mb-4">Our diverse team brings together expertise in agronomy, engineering, and data science. We believe in collaboration, innovation, and making a real impact for farmers everywhere.</p>
            <ul className="list-disc list-inside text-primary-900 text-sm">
              <li>Integrated Farm Solutions</li>
              <li>Affordable IoT Hardware</li>
              <li>AI-Driven Analytics</li>
              <li>Dedicated Support</li>
            </ul>
          </div>
        </section>
        {/* Testimonials */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6 text-center">Testimonials</h2>
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
