import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="bg-primary sticky top-0 z-30 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <img src="/images/logo.png" alt="Atama Agri Logo" className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full transition-transform hover:scale-105" />
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex flex-1 justify-center gap-7 items-center mx-auto" aria-label="Main navigation">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-textSecondary font-medium hover:text-accent transition-colors px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-accent">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <Link href="/dashboard" className="hidden md:inline-block bg-accent text-primary font-semibold px-5 py-2 rounded-full shadow hover:bg-secondary hover:text-textPrimary transition-colors flex-shrink-0 focus:outline focus:ring-2 focus:ring-accent">
          Dashboard Access
        </Link>
        {/* Mobile Hamburger */}
  <button className="md:hidden p-2 rounded focus:outline focus:ring-2 focus:ring-accent" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute top-0 right-0 w-64 h-full bg-primary shadow-lg p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
              <button className="self-end mb-2 p-1 rounded focus:outline focus:ring-2 focus:ring-accent" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
              <ul className="flex flex-col gap-4 mt-4" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="block text-lg text-textSecondary font-medium hover:text-accent px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-accent" onClick={() => setMobileOpen(false)}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-8 bg-accent text-primary font-semibold px-5 py-2 rounded-full shadow hover:bg-secondary hover:text-textPrimary transition-colors focus:outline focus:ring-2 focus:ring-accent text-center">
                Dashboard Access
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}