import React from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  text: string[];
  speed?: number;
  direction?: "left" | "right";
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 20, direction = "left" }) => {
  // bikin konten dengan bullet di kiri & kanan
  const content = text.map((item, idx) => {
    return (
      <span key={idx} className="mx-4 flex items-center">
        <span className="text-primary-700">•</span>
        <span className="mx-2">{item}</span>
        <span className="text-primary-700">•</span>
      </span>
    );
  });

  // Gandakan isi jadi 3 kali
  const repeatedContent = [...Array(3)].map((_, i) => (
    <div key={i} className="flex">{content}</div>
  ));

  return (
    <div className="overflow-hidden w-full bg-primary-100 py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-66.66%"] : ["-66.66%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
      >
        {repeatedContent}
      </motion.div>
    </div>
  );
};

export default Marquee;