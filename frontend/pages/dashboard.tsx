import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Home, Airplay } from 'lucide-react';
import { stations } from '../data/stations';

export default function Dashboard() {
	const [active, setActive] = React.useState<'dashboard' | 'drone' | 'weather' | string>('dashboard');
	return (
		<div className="min-h-screen flex flex-col bg-neutral-50">
			<Header />
			<div className="flex flex-1">
				<aside className="h-full w-60 bg-white border-r border-gray-200 flex flex-col py-6 px-3 shadow-sm">
					<div className="mb-8 text-xl font-bold tracking-wide text-primary-900 text-center">ATAMAGRI</div>
					<nav className="flex-1 flex flex-col gap-1">
						<button
							className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${active === 'dashboard' ? 'bg-primary-100 text-primary-900' : 'hover:bg-primary-50 text-primary-700'}`}
							onClick={() => setActive('dashboard')}
						>
							<span className="text-xl opacity-80"><Home /></span>
							<span className="truncate">Dashboard</span>
						</button>
						<button
							className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${active === 'drone' ? 'bg-primary-100 text-primary-900' : 'hover:bg-primary-50 text-primary-700'}`}
							onClick={() => setActive('drone')}
						>
							<span className="text-xl opacity-80"><Airplay /></span>
							<span className="truncate">Drone Control</span>
						</button>
						<div className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-primary-100">Stasiun Cuaca</div>
						{stations.map((station) => (
							<button
								key={station.id}
								className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-colors ${active === station.id ? 'bg-primary-100 text-primary-900' : 'hover:bg-primary-50 text-primary-700'}`}
								onClick={() => setActive(station.id)}
							>
								<span className="w-2 h-2 rounded-full mr-2" style={{ background: station.status === 'active' ? '#22c55e' : '#d1d5db' }}></span>
								<span className="truncate">{station.name}</span>
							</button>
						))}
						<button
							className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-colors hover:bg-primary-50 text-primary-700 mt-4"
							onClick={() => setActive('tambah-stasiun')}
						>
							<span className="text-xl opacity-80">+</span>
							<span className="truncate">Tambah Stasiun</span>
						</button>
					</nav>
				</aside>
				<main className="flex-1 p-8 md:p-12">
					{/* Konten utama dashboard tetap di sini, tidak diubah */}
				</main>
			</div>
			<Footer />
		</div>
	);
}
//
