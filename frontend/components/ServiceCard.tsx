import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ServiceCard({ title, description, image }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl transition-transform relative group">
      <div className="relative mb-4">
        <span className="absolute -top-4 -left-4 w-16 h-16 bg-accent-yellow rounded-full opacity-30 -z-10" />
        <img src={image} alt={title} className="h-24 w-24 object-contain rounded-full shadow-lg" />
        <span className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent-yellow rounded-full flex items-center justify-center">
          <ArrowUpRight className="text-primary-700 group-hover:scale-110 transition-transform" size={18} />
        </span>
      </div>
      <h4 className="font-semibold text-lg text-primary-900 mb-1">{title}</h4>
      <p className="text-primary-700 text-sm">{description}</p>
    </div>
  );
}
