import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  text: string[];
  speed?: number;
  direction?: 'left' | 'right';
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 40, direction = 'left' }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap w-full bg-primary-100 py-2">
      <motion.div
        animate={{
          x: direction === 'left' ? ['100%', '-100%'] : ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: 'linear',
        }}
        className="inline-block text-lg font-semibold text-primary-700"
      >
        {text.join('  •  ')}
      </motion.div>
    </div>
  );
};

export default Marquee;
