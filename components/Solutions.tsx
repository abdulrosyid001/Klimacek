import React from 'react';

interface SolutionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SolutionsProps {
  items: SolutionItem[];
}

const Solutions: React.FC<SolutionsProps> = ({ items }) => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Solutions for Every Scale</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-2xl shadow-lg p-6 bg-white flex flex-col items-center text-center">
          <div className="mb-4 text-4xl text-primary-700">{item.icon}</div>
          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
          <p className="text-primary-700">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Solutions;
