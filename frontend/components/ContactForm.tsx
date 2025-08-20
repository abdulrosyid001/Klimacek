import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactMessage } from '../types';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setSuccess(false);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
      reset();
    }
  };

  return (
    <form className="bg-white rounded-2xl shadow p-8 flex flex-col gap-4 w-full max-w-lg" onSubmit={handleSubmit(onSubmit)} aria-label="Contact form">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-primary-900 font-semibold mb-1">Name*</label>
          <input {...register('name')} className="w-full px-3 py-2 rounded bg-neutral-200 focus:outline-none" />
          {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
        </div>
        <div className="flex-1">
          <label className="block text-primary-900 font-semibold mb-1">Phone</label>
          <input {...register('phone')} className="w-full px-3 py-2 rounded bg-neutral-200 focus:outline-none" />
        </div>
      </div>
      <label className="block text-primary-900 font-semibold mb-1">Email*</label>
      <input {...register('email')} className="w-full px-3 py-2 rounded bg-neutral-200 focus:outline-none" />
      {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
      <label className="block text-primary-900 font-semibold mb-1">Subject</label>
      <input {...register('subject')} className="w-full px-3 py-2 rounded bg-neutral-200 focus:outline-none" />
      <label className="block text-primary-900 font-semibold mb-1">Message*</label>
      <textarea {...register('message')} rows={4} className="w-full px-3 py-2 rounded bg-neutral-200 focus:outline-none" />
      {errors.message && <span className="text-red-600 text-xs">{errors.message.message}</span>}
      <button type="submit" disabled={isSubmitting} className="mt-2 bg-primary-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-900 transition-colors focus:outline focus:ring-2 focus:ring-primary-700">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {success && <div className="text-green-700 font-semibold mt-2">Thank you! Your message has been sent.</div>}
    </form>
  );
}
