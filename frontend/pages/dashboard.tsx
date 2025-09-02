import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Home, Airplay, Settings } from 'lucide-react';
import { stations } from '../data/stations';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Dashboard() {
	const [active, setActive] = React.useState<'dashboard' | 'drone' | 'weather' | string>('dashboard');
	const router = useRouter();
	return (
		<div className="min-h-screen flex flex-col bg-neutral-50">
			<Header />
			<div className="flex flex-1">
				<aside className="h-full w-64 bg-[#2ecc71] border-r border-green-300 shadow-md flex flex-col py-6 px-4">
					<div className="mb-6 flex justify-start items-center pl-1">
						<Image src="/images/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
					</div>
					<nav className="flex-1 flex flex-col gap-1">
						<button
							className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${active === 'dashboard' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'}`}
							onClick={() => setActive('dashboard')}
							style={{ justifyContent: 'flex-start' }}
						>
							<span className="text-xl text-green-800 group-hover:text-green-900 transition-colors"><Home /></span>
							<span className="truncate font-normal">Dashboard</span>
						</button>
						<button
							className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-normal transition-all duration-150 text-left ${active === 'drone' ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'}`}
							onClick={() => setActive('drone')}
							style={{ justifyContent: 'flex-start' }}
						>
							<span className="text-xl text-green-800 group-hover:text-green-900 transition-colors"><Airplay /></span>
							<span className="truncate font-normal">Drone Control</span>
						</button>
						<div className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-green-100">Stasiun Cuaca</div>
						{stations.map((station) => (
							<button
								key={station.id}
								className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 text-left ${active === station.id ? 'bg-white/80 text-green-900 shadow-sm' : 'hover:bg-green-100 text-green-900'}`}
								onClick={() => setActive(station.id)}
								style={{ justifyContent: 'flex-start' }}
							>
								<span className={`w-2 h-2 rounded-full mr-2 ${station.status === 'active' ? 'bg-green-600' : 'bg-gray-300'}`}></span>
								<span className="truncate font-normal">{station.name}</span>
							</button>
						))}
						<button
							className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 hover:bg-green-100 text-green-900 mt-3 text-left"
							onClick={() => router.push('/stations-add')}
							style={{ justifyContent: 'flex-start' }}
						>
							<span className="text-xl text-green-800 group-hover:text-green-900 transition-colors">+</span>
							<span className="truncate font-normal">Tambah Stasiun</span>
						</button>
					</nav>
					<button
						className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-normal transition-all duration-150 hover:bg-green-100 text-green-900 mt-6 text-left"
						onClick={() => router.push('/settings')}
						style={{ justifyContent: 'flex-start' }}
					>
						<span className="text-xl text-green-800 group-hover:text-green-900 transition-colors"><Settings /></span>
						<span className="truncate font-normal">User Setting</span>
					</button>
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
