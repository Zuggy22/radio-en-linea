import React from 'react';

// A simulated visualizer using CSS keyframes because real AudioContext visualizers
// often break with Cross-Origin streams (CORS) from public radio APIs.
const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const barCount = 12;
  
  return (
    <div className="flex items-end justify-center space-x-1 h-12">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-gradient-to-t from-brand-secondary to-brand-accent rounded-t-sm transition-all duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-30 h-1'
          }`}
          style={{
            animation: isPlaying 
              ? `soundWave ${0.8 + Math.random() * 0.6}s ease-in-out infinite` 
              : 'none',
            animationDelay: `-${Math.random()}s`,
            height: isPlaying ? '40%' : '10%' // Base height handled by keyframe but fallback here
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;