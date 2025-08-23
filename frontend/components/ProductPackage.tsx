import React from 'react';

interface ProductPackageProps {
  packages: {
    title: string;
    price: string;
    features: string[];
    accent?: string;
    best?: boolean;
  }[];
}

const ProductPackage: React.FC<ProductPackageProps> = ({ packages }) => (
  <section className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Our Product Package</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {packages.map((pkg, idx) => (
        <div
          key={idx}
          className={`rounded-2xl shadow-lg p-6 bg-white flex-1 ${pkg.best ? 'border-4 border-primary-700' : ''}`}
        >
          <h3 className="font-bold text-xl mb-2">{pkg.title}</h3>
          <div className="text-3xl font-bold text-primary-700 mb-4">{pkg.price}</div>
          <ul className="mb-4 text-primary-700">
            {pkg.features.map((f, i) => (
              <li key={i} className="mb-1">• {f}</li>
            ))}
          </ul>
          {pkg.best && <div className="text-xs font-bold text-primary-700">Best Value</div>}
        </div>
      ))}
    </div>
  </section>
);

export default ProductPackage;
