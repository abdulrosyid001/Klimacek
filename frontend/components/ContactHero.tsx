import React from 'react';

interface ContactHeroProps {
  title: string;
  backgroundImage: string;
  subtitle?: string;
}

const ContactHero: React.FC<ContactHeroProps> = ({ title, backgroundImage, subtitle }) => (
  <section
    className="relative w-full h-64 md:h-80 flex items-center justify-center text-center mb-8"
    style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
    <div className="absolute inset-0 bg-primary-900/60" />
    <div className="relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">{title}</h1>
      {subtitle && <p className="text-lg md:text-xl text-white drop-shadow">{subtitle}</p>}
    </div>
  </section>
);

export default ContactHero;
