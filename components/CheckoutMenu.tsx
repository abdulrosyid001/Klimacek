import React from 'react';

interface CheckoutMenuProps {
  links: { label: string; href: string }[];
}

const CheckoutMenu: React.FC<CheckoutMenuProps> = ({ links }) => (
  <section className="max-w-4xl mx-auto px-4 py-12 text-center bg-secondary">
    <div className="bg-primary text-textSecondary p-4 rounded-lg mb-6">
      Warna Custom Tailwind Aktif 🚀
    </div>
    <h2 className="font-serif text-3xl font-bold text-primary mb-8 text-textPrimary">Ready to Get Started?</h2>
    <div className="flex flex-wrap gap-6 justify-center">
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.href}
          className="bg-primary text-textSecondary px-8 py-3 rounded-full font-semibold shadow hover:bg-accent hover:text-textPrimary transition-colors focus:outline focus:ring-2 focus:ring-primary"
        >
          {link.label}
        </a>
      ))}
    </div>
  </section>
);

export default CheckoutMenu;
