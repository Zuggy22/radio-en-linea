import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Radio } from 'lucide-react';
import { Station } from '../types';

interface PlayerBarProps {
  station: Station | null;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
  onStop?: () => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ 
  station, 
  isPlaying, 
  volume,
  isLoading, 
  onTogglePlay, 
  onVolumeChange 
}) => {
  const [localVolume, setLocalVolume] = React.useState(volume);

  const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLocalVolume(val);
    onVolumeChange(val);
  };

  if (!station) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700 p-4 pb-6 md:pb-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Station Info */}
        <div className="flex items-center space-x-4 w-full md:w-1/3">
           <div className="h-12 w-12 rounded bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 relative">
              {station.favicon ? (
                 <img src={station.favicon} alt="logo" className="h-full w-full object-cover" />
              ) : (
                 <Radio size={20} className="text-slate-500" />
              )}
              {/* Loader Overlay */}
              {isLoading && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                 </div>
              )}
           </div>
           <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate">{station.name}</h4>
              <p className="text-xs text-brand-accent truncate animate-pulse">
                 {isLoading ? 'Connecting...' : 'Live Stream'}
              </p>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 w-full md:w-1/3">
           <button className="text-slate-400 hover:text-white transition-colors">
              <SkipBack size={20} />
           </button>
           
           <button 
             onClick={onTogglePlay}
             disabled={isLoading}
             className="h-12 w-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isPlaying && !isLoading ? (
                 <Pause size={24} fill="currentColor" />
              ) : (
                 <Play size={24} fill="currentColor" className="ml-1" />
              )}
           </button>

           <button className="text-slate-400 hover:text-white transition-colors">
              <SkipForward size={20} />
           </button>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end space-x-3 w-1/3">
           <button onClick={() => onVolumeChange(localVolume === 0 ? 0.5 : 0)}>
             {localVolume === 0 ? <VolumeX size={20} className="text-slate-400" /> : <Volume2 size={20} className="text-brand-accent" />}
           </button>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={localVolume} 
             onChange={handleVolChange}
             className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
           />
        </div>
      </div>
      
      {/* Mobile Volume (visible only on small screens) */}
      <div className="md:hidden w-full flex items-center space-x-3 px-4 mt-2">
         <Volume2 size={16} className="text-slate-500" />
         <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={localVolume} 
             onChange={handleVolChange}
             className="w-full h-1 bg-slate-700 rounded-lg appearance-none"
           />
      </div>
    </div>
  );
};

export default PlayerBar;