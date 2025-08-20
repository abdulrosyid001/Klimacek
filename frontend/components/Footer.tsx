import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-neutral-100 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/images/logo.png" alt="Atama Agri Logo" className="h-8 w-8 rounded-full bg-primary-700" />
            <span className="font-serif text-lg font-bold">ATAMAGRI</span>
          </div>
          <p className="text-neutral-200 text-sm mb-4">Climate intelligence for smart agriculture. Empowering farmers with data-driven tools, IoT, and AI for a sustainable future.</p>
          <p className="text-neutral-300 text-xs">&copy; {new Date().getFullYear()} Atama Agri. All rights reserved.</p>
        </div>
        {/* Navigation */}
        <div>
          <h4 className="font-semibold mb-3 text-accent-yellow">Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/products" className="hover:underline">Products</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
          </ul>
        </div>
        {/* Contact & Newsletter */}
        <div>
          <h4 className="font-semibold mb-3 text-accent-yellow">Contact</h4>
          <p className="text-neutral-200 text-sm">Email: <a href="mailto:info@atamagri.com" className="underline">info@atamagri.com</a></p>
          <p className="text-neutral-200 text-sm">Phone: <a href="tel:+628123456789" className="underline">+62 812-3456-789</a></p>
          <form className="mt-4 flex gap-2">
            <input type="email" placeholder="Your email" className="px-3 py-2 rounded-l bg-neutral-200 text-primary-900 focus:outline-none" aria-label="Newsletter email" />
            <button type="submit" className="bg-accent-yellow text-primary-900 px-4 py-2 rounded-r font-semibold hover:bg-primary-500 hover:text-white transition-colors">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
