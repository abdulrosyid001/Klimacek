import React from 'react';
import { Home, Airplay, CloudSun } from 'lucide-react';

interface SidebarProps {
  active: 'dashboard' | 'drone' | 'weather';
  onNavigate: (menu: 'dashboard' | 'drone' | 'weather') => void;
}

const menus = [
  { key: 'dashboard', label: 'Dashboard', icon: <Home />, href: '/dashboard' },
  { key: 'drone', label: 'Drone Control', icon: <Airplay /> },
  { key: 'weather', label: 'Weather Station', icon: <CloudSun /> },
];

const Sidebar: React.FC<SidebarProps> = ({ active, onNavigate }) => (
  <aside className="h-full w-64 bg-primary-900 text-white flex flex-col py-8 px-4 rounded-2xl shadow-lg">
    <div className="mb-10 text-2xl font-bold tracking-wide text-center">ATAMAGRI</div>
    <nav className="flex-1 flex flex-col gap-4">
      {menus.map((menu) => (
        <button
          key={menu.key}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-semibold transition-colors ${active === menu.key ? 'bg-primary-700' : 'hover:bg-primary-800'}`}
          onClick={() => onNavigate(menu.key as any)}
        >
          <span className="text-xl">{menu.icon}</span>
          {menu.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
