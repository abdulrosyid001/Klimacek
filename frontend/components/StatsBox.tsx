import React from 'react';

interface StatsBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: 'yellow' | 'green';
}

export default function StatsBox({ label, value, icon, accent = 'green' }: StatsBoxProps) {
  const accentClass = accent === 'yellow' ? 'bg-accent-yellow text-primary-900' : 'bg-primary-700 text-white';
  return (
    <div className={`rounded-xl shadow p-5 flex flex-col items-center min-w-[120px] ${accentClass}`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
    </div>
  );
}
