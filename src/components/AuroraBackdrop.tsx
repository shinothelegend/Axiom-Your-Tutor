import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AuroraBackdrop: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Slow, subtle drifting animation for shapes
  const createAuroraAnimation = (duration: number, delay: number = 0) => {
    if (shouldReduceMotion) return {};
    
    return {
      x: ["0%", "5%", "-5%", "0%"],
      y: ["0%", "-5%", "5%", "0%"],
      scale: [1, 1.05, 0.95, 1],
      transition: {
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const,
        delay
      }
    };
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-40 dark:opacity-20 mix-blend-screen dark:mix-blend-lighten">
      {/* Shape 1: Soft White/Pink Top Left */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] bg-gradient-to-tr from-[#F6D7DE] to-white/80 dark:from-[#2a1a20] dark:to-[#1a1a2a]"
        animate={createAuroraAnimation(25)}
      />
      
      {/* Shape 2: Pale Rose Right */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] rounded-full blur-[120px] bg-gradient-to-bl from-[#F6D7DE]/80 to-transparent dark:from-[#3a202a] dark:to-transparent"
        animate={createAuroraAnimation(30, 2)}
      />
      
      {/* Shape 3: Muted Neutral Bottom Center */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[40vw] rounded-full blur-[120px] bg-gradient-to-t from-[#f0e6e8] to-transparent dark:from-[#1f1b20] dark:to-transparent"
        animate={createAuroraAnimation(35, 4)}
      />
    </div>
  );
};
