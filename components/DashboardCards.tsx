import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export function DashboardCard({ title, value, icon, color = 'bg-primary-700' }: DashboardCardProps) {
  return (
    <div className={`rounded-xl shadow p-5 flex flex-col items-center min-w-[120px] ${color} text-white`}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide">{title}</div>
    </div>
  );
}

export default DashboardCardProps;
