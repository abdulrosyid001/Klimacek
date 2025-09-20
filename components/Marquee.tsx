import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
  text: string[];
  speed?: number;
  direction?: "left" | "right";
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 20, direction = "left" }) => {
  const content = text.join("  •  ");
  const ref = useRef<HTMLDivElement>(null);
  const [numDuplicates, setNumDuplicates] = useState(2);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const updateMeasurements = () => {
      if (ref.current) {
        const totalWidth = ref.current.scrollWidth;
        const singleWidth = totalWidth / numDuplicates;
        const viewportWidth = window.innerWidth;

        setContentWidth(singleWidth);

        // Calculate needed duplicates to cover at least 2x viewport (for seamless looping without gaps)
        const neededDuplicates = Math.ceil((viewportWidth * 2) / singleWidth);
        if (neededDuplicates > numDuplicates) {
          setNumDuplicates(neededDuplicates);
        }
      }
    };

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, [numDuplicates, content]);

  return (
    <div className="overflow-hidden w-full bg-primary-100 py-4">
      <motion.div
        ref={ref}
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0px", `-${contentWidth}px`] : [`-${contentWidth}px`, "0px"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {Array.from({ length: numDuplicates }).map((_, index) => (
          <span
            key={index}
            className="text-4xl md:text-5xl font-bold text-primary-700 px-8"
          >
            {content}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;