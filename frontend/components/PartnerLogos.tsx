import React from 'react';
import { partners } from '../data/partners';

export default function PartnerLogos() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 py-6">
      {partners.map((partner) => (
        <div key={partner.name} className="flex flex-col items-center">
          <img src={partner.logo} alt={partner.name} className="h-12 w-auto object-contain mb-1" />
          <span className="text-xs text-primary-900 font-medium">{partner.name}</span>
        </div>
      ))}
    </div>
  );
}
