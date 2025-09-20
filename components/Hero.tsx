import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full bg-beige rounded-[24px] mt-8 mb-12 shadow-lg overflow-hidden flex flex-col md:flex-row items-center px-6 py-10 md:py-16 md:px-12 relative">
      {/* Left: Text */}
      <motion.div
        className="flex-1 z-10"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-6 leading-tight">
          Climate Intelligence for <span className="text-primary-700">Smart Agriculture</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-700 mb-8 max-w-xl">
          Empowering farmers with real-time data, AI-powered insights, and IoT solutions for a sustainable future.
        </p>
        <div className="flex gap-4">
          <Link href="/contact" className="bg-primary-700 text-white px-7 py-3 rounded-full font-semibold shadow hover:bg-primary-900 transition-colors focus:outline focus:ring-2 focus:ring-primary-700">
            Contact Us
          </Link>
          <Link href="/products" className="text-primary-700 font-semibold underline underline-offset-4 hover:text-primary-900 px-4 py-3 rounded focus:outline focus:ring-2 focus:ring-primary-700">
            Our Product
          </Link>
        </div>
      </motion.div>
      {/* Right: Product Visuals */}
      <motion.div
        className="flex-1 flex flex-col items-center gap-8 mt-10 md:mt-0 z-10"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="relative flex flex-col items-center gap-8">
          {/* Laptop Dashboard */}
          <div className="relative">
            <span className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500 rounded-full opacity-30 -z-10" />
            <img src="/images/product-laptop.png" alt="Dashboard" className="h-32 md:h-40 rounded-xl shadow-lg" />
          </div>
          {/* Sensor Pole */}
          <div className="relative">
            <span className="absolute -top-4 -right-8 w-16 h-16 bg-accent-yellow rounded-full opacity-40 -z-10" />
            <img src="/images/product-sensor.png" alt="Sensor Pole" className="h-24 md:h-28 rounded-xl shadow-lg" />
          </div>
          {/* Drone */}
          <div className="relative">
            <span className="absolute -bottom-4 -left-8 w-16 h-16 bg-primary-700 rounded-full opacity-30 -z-10" />
            <img src="/images/product-drone.png" alt="Drone" className="h-20 md:h-24 rounded-xl shadow-lg" />
          </div>
        </div>
      </motion.div>
      {/* Decorative Circles */}
      <span className="absolute top-0 left-0 w-32 h-32 bg-accent-yellow rounded-full opacity-20 -z-10" />
      <span className="absolute bottom-0 right-0 w-40 h-40 bg-primary-500 rounded-full opacity-10 -z-10" />
    </section>
  );
}
