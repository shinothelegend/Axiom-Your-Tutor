import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const BlockyBackdrop: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  
  // Create a grid of blocks.
  const blocks = useMemo(() => {
    const arr = [];
    // 20 cols x 15 rows = 300 blocks
    for (let i = 0; i < 300; i++) {
      // Only animate a subset of blocks to keep it subtle
      const isAnimated = Math.random() > 0.7;
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * 5;
      
      arr.push({ id: i, isAnimated, duration, delay });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 select-none flex items-center justify-center">
      {/* Fade out the edges into the background color to integrate smoothly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#0B0D11_75%)] z-10" />
      
      <div 
        className="w-full h-full max-w-7xl max-h-[800px] grid" 
        style={{ 
          gridTemplateColumns: 'repeat(20, 1fr)', 
          gridTemplateRows: 'repeat(15, 1fr)', 
          gap: '1px' 
        }}
      >
        {blocks.map((block) => (
          <div key={block.id} className="w-full h-full border border-white/[0.015]">
            {block.isAnimated && (
              <motion.div
                className="w-full h-full bg-white/[0.03]"
                initial={{ opacity: 0 }}
                animate={
                  shouldReduceMotion 
                    ? { opacity: 0.1 }
                    : { opacity: [0, 0.4, 0] }
                }
                transition={
                  shouldReduceMotion
                    ? {}
                    : {
                        duration: block.duration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: block.delay,
                      }
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
