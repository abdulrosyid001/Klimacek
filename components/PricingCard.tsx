import React from 'react';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  accent?: 'yellow' | 'green';
  best?: boolean;
  cta?: string;
}

export default function PricingCard({ title, price, features, accent = 'yellow', best = false, cta = 'Buy Now' }: PricingCardProps) {
  const accentClass = accent === 'yellow' ? 'bg-accent-yellow text-primary-900' : 'bg-primary-700 text-white';
  return (
    <div className={`relative rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-xs ${accentClass} ${best ? 'ring-4 ring-primary-700' : ''}`}>
      {best && (
        <span className="absolute top-4 right-4 bg-accent-yellow text-primary-900 text-xs font-bold px-3 py-1 rounded-full shadow">Best Price</span>
      )}
      <h3 className="font-serif text-2xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-extrabold mb-4">{price}</div>
      <ul className="text-sm text-primary-900/80 mb-6 list-disc list-inside">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <button className="mt-auto bg-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-900 transition-colors focus:outline focus:ring-2 focus:ring-primary-700">
        {cta}
      </button>
    </div>
  );
}
