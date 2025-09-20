import React from 'react';

interface CheckoutMenuProps {
  links: { label: string; href: string }[];
}

const CheckoutMenu: React.FC<CheckoutMenuProps> = ({ links }) => (
  <section className="max-w-4xl mx-auto px-4 py-12 text-center">
    <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8">Ready to Get Started?</h2>
    <div className="flex flex-wrap gap-6 justify-center">
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.href}
          className="bg-primary-700 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-primary-900 transition-colors focus:outline focus:ring-2 focus:ring-primary-700"
        >
          {link.label}
        </a>
      ))}
    </div>
  </section>
);

export default CheckoutMenu;
