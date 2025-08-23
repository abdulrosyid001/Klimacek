import React from 'react';

interface AgricultureMattersProps {
  title: string;
  description: string;
  image: string;
}

const AgricultureMatters: React.FC<AgricultureMattersProps> = ({ title, description, image }) => (
  <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div className="flex justify-center">
      <img src={image} alt={title} className="rounded-2xl shadow-lg w-80 h-80 object-cover" />
    </div>
    <div>
      <h2 className="font-serif text-3xl font-bold text-primary-900 mb-3">{title}</h2>
      <p className="text-primary-700 text-lg">{description}</p>
    </div>
  </section>
);

export default AgricultureMatters;
