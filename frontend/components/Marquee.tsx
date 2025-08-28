import React from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  text: string[];
  speed?: number;
  direction?: "left" | "right";
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 20, direction = "left" }) => {
  const content = text.join("  •  ");

  return (
    <div className="overflow-hidden w-full bg-primary-100 py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
      >
        <span className="text-4xl md:text-5xl font-bold text-primary-700 px-4">
          {content}
        </span>
        <span className="text-4xl md:text-5xl font-bold text-primary-700 px-4">
          {content}
        </span>
      </motion.div>
    </div>
  );
};

export default Marquee;