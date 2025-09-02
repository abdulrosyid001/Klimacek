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
						<aside className="h-full w-64 bg-gray-50 border-r border-gray-200 shadow-sm flex flex-col py-6 px-4">
							<div className="mb-8 text-lg font-semibold tracking-wide text-primary-800 text-center">ATAMAGRI</div>
							<nav className="flex-1 flex flex-col gap-1">
								<button
									className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 ${active === 'dashboard' ? 'bg-primary-50 text-primary-900 shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
									onClick={() => setActive('dashboard')}
								>
									<span className="text-xl text-gray-400 group-hover:text-primary-500 transition-colors"><Home /></span>
									<span className="truncate font-normal">Dashboard</span>
								</button>
								<button
									className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 ${active === 'drone' ? 'bg-primary-50 text-primary-900 shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
									onClick={() => setActive('drone')}
								>
									<span className="text-xl text-gray-400 group-hover:text-primary-500 transition-colors"><Airplay /></span>
									<span className="truncate font-normal">Drone Control</span>
								</button>
								<div className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Stasiun Cuaca</div>
								{stations.map((station) => (
									<button
										key={station.id}
										className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 ${active === station.id ? 'bg-primary-50 text-primary-900 shadow-sm' : 'hover:bg-gray-100 text-gray-700'}`}
										onClick={() => setActive(station.id)}
									>
										<span className={`w-2 h-2 rounded-full mr-2 ${station.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
										<span className="truncate font-normal">{station.name}</span>
									</button>
								))}
								<button
									className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 hover:bg-gray-100 text-gray-700 mt-4"
									onClick={() => setActive('tambah-stasiun')}
								>
									<span className="text-xl text-gray-400 group-hover:text-primary-500 transition-colors">+</span>
									<span className="truncate font-normal">Tambah Stasiun</span>
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
