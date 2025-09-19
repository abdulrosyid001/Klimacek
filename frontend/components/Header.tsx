import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'IoT Monitor', href: '/iot-dashboard' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="bg-beige sticky top-0 z-30 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <img src="/images/logo.png" alt="Atama Agri Logo" className="h-12 w-12 rounded-full" />
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex flex-1 justify-center gap-7 items-center mx-auto" aria-label="Main navigation">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-primary-900 font-medium hover:text-primary-700 transition-colors px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <Link href="/weather-dashboard" className="hidden md:inline-block bg-accent-yellow text-primary-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-primary-500 hover:text-white transition-colors flex-shrink-0 focus:outline focus:ring-2 focus:ring-accent-yellow">
          Dashboard Access
        </Link>
        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded focus:outline focus:ring-2 focus:ring-primary-700" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-0 right-0 w-64 h-full bg-beige shadow-lg p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
              <button className="self-end mb-2 p-1 rounded focus:outline focus:ring-2 focus:ring-primary-700" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
              <ul className="flex flex-col gap-4 mt-4" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="block text-lg text-primary-900 font-medium hover:text-primary-700 px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary-700" onClick={() => setMobileOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/weather-dashboard" className="mt-8 bg-accent-yellow text-primary-900 font-semibold px-5 py-2 rounded-full shadow hover:bg-primary-500 hover:text-white transition-colors focus:outline focus:ring-2 focus:ring-accent-yellow text-center">
                Dashboard Access
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}