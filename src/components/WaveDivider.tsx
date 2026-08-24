import React from 'react';

export const WaveDivider: React.FC = () => {
  return (
    <div className="w-full overflow-hidden leading-[0] text-black/10 dark:text-white/10 my-16">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[32px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1200,60 1250,60"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
