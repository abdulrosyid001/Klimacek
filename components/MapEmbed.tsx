import React from 'react';

interface MapEmbedProps {
  src?: string;
  height?: number;
}

export default function MapEmbed({ src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126917.6642857572!2d107.560755!3d-6.903449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7c3e6b7b6b1%3A0x401e8f1fc28c6e0!2sBandung!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid', height = 320 }: MapEmbedProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow my-6">
      <iframe
        src={src}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label="Google Map"
        title="Location Map"
      />
    </div>
  );
}
