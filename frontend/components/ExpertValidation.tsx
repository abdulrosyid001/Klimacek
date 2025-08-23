import React from 'react';

interface Expert {
  name: string;
  title: string;
  photo: string;
}
interface ExpertValidationProps {
  experts: Expert[];
  logos: string[];
}

const ExpertValidation: React.FC<ExpertValidationProps> = ({ experts, logos }) => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-900 mb-8 text-center">Validated by Experts, Recognized by Industry</h2>
    <div className="flex flex-wrap gap-8 justify-center mb-8">
      {experts.map((e, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <img src={e.photo} alt={e.name} className="w-20 h-20 rounded-full mb-2 object-cover border-4 border-primary-200" />
          <div className="font-semibold text-primary-900">{e.name}</div>
          <div className="text-primary-700 text-sm">{e.title}</div>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-6 justify-center items-center">
      {logos.map((logo, idx) => (
        <img key={idx} src={logo} alt="Industry Logo" className="h-12 object-contain" />
      ))}
    </div>
  </section>
);

export default ExpertValidation;
