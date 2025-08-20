import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
import ContactCard from '../components/ContactCard';
import MapEmbed from '../components/MapEmbed';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - ATAMAGRI</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen">
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="font-serif text-4xl font-bold text-primary-900 mb-4">Contact Us</h1>
          <p className="text-lg text-primary-700 mb-8">We'd love to hear from you! Reach out for product info, partnership, or support.</p>
        </section>
        {/* Contact Info Row */}
        <section className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 mb-12">
          <ContactCard icon={Mail} title="Mail Us" value="info@atamagri.com" href="mailto:info@atamagri.com" />
          <ContactCard icon={Phone} title="Call Us" value="+62 812-3456-789" href="tel:+628123456789" />
          <ContactCard icon={MapPin} title="Our Location" value="Bandung, Indonesia" />
        </section>
        {/* Main Contact Block */}
        <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
          <div className="flex justify-center">
            <img src="/images/team-photo.jpg" alt="ATAMAGRI Expo" className="rounded-2xl shadow-lg w-80 h-80 object-cover" />
          </div>
          <div>
            <ContactForm />
          </div>
        </section>
        {/* Map Embed */}
        <section className="max-w-6xl mx-auto px-4 mb-12">
          <MapEmbed />
        </section>
      </main>
      <Footer />
    </>
  );
}
