import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
}

export default function ContactCard({ icon: Icon, title, value, href }: ContactCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center min-w-[160px]">
      <div className="bg-primary-500/10 rounded-full p-3 mb-2">
        <Icon className="text-primary-700" size={28} aria-hidden="true" />
      </div>
      <h4 className="font-semibold text-base text-primary-900 mb-1">{title}</h4>
      {href ? (
        <a href={href} className="text-primary-700 text-sm underline break-all">{value}</a>
      ) : (
        <p className="text-primary-700 text-sm break-all">{value}</p>
      )}
    </div>
  );
}