import React from 'react';

interface Award {
  photo: string;
  position: string;
  competition: string;
}

interface ExpertValidationProps {
  awards: Award[];
}

const ExpertValidation: React.FC<ExpertValidationProps> = ({ awards }) => (
  <section className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-900 mb-8 text-center">
      Validated by Experts, Recognized by Industry
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center mb-8">
      {awards.map((award, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <img
            src={award.photo}
            alt={award.competition}
            className="w-28 h-28 md:w-32 md:h-32 rounded-xl mb-3 object-cover border-4 border-primary-200 shadow-md"
          />
          <div className="font-semibold text-primary-900">{award.position}</div>
          <div className="text-primary-700 text-sm text-center">{award.competition}</div>
        </div>
      ))}
    </div>
  </section>
);

export default ExpertValidation;
