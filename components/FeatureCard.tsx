import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow min-w-[180px]">
      <div className="bg-primary-500/10 rounded-full p-3 mb-3">
        <Icon className="text-primary-700" size={32} aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-lg text-primary-900 mb-1">{title}</h3>
      <p className="text-primary-700 text-sm">{description}</p>
    </div>
  );
}
