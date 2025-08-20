import React from 'react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center min-w-[260px] max-w-xs mx-auto">
      <img src={testimonial.avatar || '/images/avatar-default.jpg'} alt={testimonial.name} className="h-16 w-16 rounded-full mb-3 object-cover border-4 border-accent-yellow" />
      <h4 className="font-semibold text-lg text-primary-900 mb-1">{testimonial.name}</h4>
      {testimonial.role && <p className="text-primary-700 text-xs mb-2">{testimonial.role}</p>}
      <p className="text-primary-900 text-sm mb-2">“{testimonial.text}”</p>
      {testimonial.rating && (
        <div className="flex gap-1 mt-2">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <span key={i} aria-label="star" className="text-yellow-400 text-lg">★</span>
          ))}
        </div>
      )}
    </div>
  );
}
