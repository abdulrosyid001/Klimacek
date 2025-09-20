import React from 'react';
import ServiceCard from './ServiceCard';

interface BestAgricultureProps {
  title?: string;
  services?: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  className?: string;
}

const defaultServices = [
  {
    title: 'Atama Climate',
    description: 'Weather station for hyperlocal climate data.',
    image: '/images/product-sensor.png',
  },
  {
    title: 'Atama Vis',
    description: 'Drone system for aerial crop monitoring.',
    image: '/images/product-drone.png',
  },
  {
    title: 'Atama Sense',
    description: 'Farm dashboard for real-time insights.',
    image: '/images/product-laptop.png',
  },
];

export default function BestAgriculture({
  title = 'Best Agriculture Services',
  services = defaultServices,
  className = '',
}: BestAgricultureProps) {
  return (
    <section className={`max-w-7xl mx-auto px-4 py-12 ${className}`}>
      <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s) => (
          <ServiceCard key={s.title} title={s.title} description={s.description} image={s.image} />
        ))}
      </div>
    </section>
  );
}
