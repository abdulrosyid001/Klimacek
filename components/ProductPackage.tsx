import React from 'react';
import Link from 'next/link';

interface ProductPackageProps {
  packages: {
    title: string;
    price: string;
    features: string[];
    accent?: string;
    best?: boolean;
    image?: string;
  }[];
}

const ProductPackage: React.FC<ProductPackageProps> = ({ packages }) => (
  <section className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Our Product Package</h2>
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      {packages.map((pkg, idx) => (
        <div
          key={idx}
          className={`rounded-2xl shadow-lg p-6 bg-white flex-1 flex flex-col md:flex-row items-center gap-4 ${pkg.best ? 'border-4 border-primary-700' : ''}`}
        >
          {pkg.image && (
            <img src={pkg.image} alt={pkg.title} className="w-28 h-28 object-contain mb-4 md:mb-0 md:mr-4" />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2">{pkg.title}</h3>
            <div className="text-3xl font-bold text-primary-700 mb-4">{pkg.price}</div>
            <ul className="mb-4 text-primary-700">
              {pkg.features.map((f, i) => (
                <li key={i} className="mb-1">• {f}</li>
              ))}
            </ul>
            {pkg.best && <div className="text-xs font-bold text-primary-700">Best Value</div>}
            <Link
              href={`/checkout/package/${pkg.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="mt-4 w-full bg-green-600 text-white rounded-full py-2 font-semibold hover:bg-green-700 transition text-center block"
            >
              Checkout
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProductPackage;
