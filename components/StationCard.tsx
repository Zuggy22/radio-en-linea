import React, { useState } from 'react';
import { Play, Pause, Music, Radio } from 'lucide-react';
import { Station } from '../types';

interface StationCardProps {
  station: Station;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: (station: Station) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, isPlaying, isActive, onPlay }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback image logic
  const handleImgError = () => setImgError(true);

  return (
    <div 
      onClick={() => onPlay(station)}
      className={`
        group relative overflow-hidden rounded-xl p-4 transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-indigo-900/40 border border-brand-accent/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
          : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
          {!imgError && station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleImgError}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              <Radio size={24} />
            </div>
          )}
          
          {/* Overlay Play Button */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isActive && isPlaying ? (
               <Pause className="text-white drop-shadow-md" size={24} fill="white" />
            ) : (
               <Play className="text-white drop-shadow-md" size={24} fill="white" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`truncate text-sm font-bold ${isActive ? 'text-brand-accent' : 'text-slate-100'}`}>
            {station.name}
          </h3>
          <p className="truncate text-xs text-slate-400 mt-1">
            {station.tags || 'Unknown Genre'}
          </p>
          <div className="mt-2 flex items-center space-x-2">
             <span className="inline-flex items-center rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 ring-1 ring-inset ring-slate-700/50">
               {station.bitrate ? `${station.bitrate}k` : 'Live'}
             </span>
             {isActive && (
                <div className="flex space-x-[2px] items-end h-3">
                    <div className="w-1 bg-brand-accent animate-[soundWave_0.6s_infinite] h-full"></div>
                    <div className="w-1 bg-brand-accent animate-[soundWave_1.1s_infinite] h-full"></div>
                    <div className="w-1 bg-brand-accent animate-[soundWave_0.8s_infinite] h-full"></div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;