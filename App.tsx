import React, { useState, useEffect, useRef } from 'react';
import { Search, Radio, Heart, Globe, RefreshCcw, Github } from 'lucide-react';
import { searchStations, getTopStations, getByGenre } from './services/radioApi';
import StationCard from './components/StationCard';
import PlayerBar from './components/PlayerBar';
import Visualizer from './components/Visualizer';
import { Station } from './types';

// Constants
const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip Hop', 'News', 'Country', 'Blues'];

function App() {
  // Data State
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('Top');

  // Player State
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // --- Initialization ---
  useEffect(() => {
    loadTopStations();
    
    // Setup Audio Listeners
    const audio = audioRef.current;
    
    const onPlay = () => { setIsPlaying(true); setIsLoadingStream(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoadingStream(true);
    const onCanPlay = () => setIsLoadingStream(false);
    const onError = (e: Event) => {
      console.error("Audio Error", e);
      setIsLoadingStream(false);
      setIsPlaying(false);
      setPlayerError("Stream unavailable or blocked.");
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  // --- Logic ---
  const loadTopStations = async () => {
    setLoadingData(true);
    setActiveTag('Top');
    const data = await getTopStations(30);
    setStations(data);
    setLoadingData(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoadingData(true);
    setActiveTag('Search');
    const data = await searchStations(searchQuery);
    setStations(data);
    setLoadingData(false);
  };

  const handleGenreClick = async (genre: string) => {
    setLoadingData(true);
    setActiveTag(genre);
    setSearchQuery('');
    const data = await getByGenre(genre);
    setStations(data);
    setLoadingData(false);
  };

  const playStation = (station: Station) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      // Toggle if same station
      togglePlay();
      return;
    }

    setPlayerError(null);
    setIsLoadingStream(true);
    setCurrentStation(station);
    
    // Update Audio Source
    const audio = audioRef.current;
    audio.src = station.url_resolved || station.url;
    audio.volume = volume;
    audio.play().catch(e => {
        console.error("Play failed", e);
        setIsPlaying(false);
        setIsLoadingStream(false);
        setPlayerError("Cannot play this stream.");
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error(e));
    }
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    audioRef.current.volume = val;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2" onClick={loadTopStations} role="button">
              <div className="h-8 w-8 rounded-lg bg-brand-accent flex items-center justify-center text-slate-900">
                <Radio size={20} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-secondary">
                  GenRadio
                </span>
                <span className="text-[10px] text-slate-500 block leading-3 tracking-wider">ID: CLIENT-0288</span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search stations, countries, tags..."
                 className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all group-hover:bg-slate-800/80"
               />
               <Search className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            </form>

            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white transition-colors" title="Favorites (Coming Soon)">
                <Heart size={20} />
              </button>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Mobile Search (visible on small screens) */}
        <div className="md:hidden px-4 pb-3">
             <form onSubmit={handleSearch} className="relative">
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search stations..."
                 className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand-accent"
               />
               <Search className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-32">
        <div className="max-w-7xl mx-auto">
          
          {/* Visualizer & Status Area */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {activeTag === 'Top' ? 'Trending Stations' : activeTag}
              </h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Globe size={14} />
                Exploring global frequencies
              </p>
            </div>
            
            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button 
                onClick={loadTopStations}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeTag === 'Top' ? 'bg-brand-accent text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Top
              </button>
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeTag === genre ? 'bg-brand-accent text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {genre}
                </button>
              ))}
            </div>
            
            <div className="hidden md:block">
              <Visualizer isPlaying={isPlaying} />
            </div>
          </div>

          {/* Player Error Alert */}
          {playerError && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <RefreshCcw size={18} />
              <span>{playerError} <span className="text-sm opacity-70">(Try a different station)</span></span>
            </div>
          )}

          {/* Grid */}
          {loadingData ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse"></div>
                ))}
             </div>
          ) : stations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {stations.map((station) => (
                <StationCard
                  key={station.stationuuid}
                  station={station}
                  isPlaying={isPlaying && currentStation?.stationuuid === station.stationuuid}
                  isActive={currentStation?.stationuuid === station.stationuuid}
                  onPlay={playStation}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <Radio size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-slate-400">No stations found</h3>
              <p className="mt-2">Try searching for something else or browse genres.</p>
            </div>
          )}
        </div>
      </main>

      {/* Player Bar */}
      <PlayerBar 
        station={currentStation}
        isPlaying={isPlaying}
        isLoading={isLoadingStream}
        volume={volume}
        onTogglePlay={togglePlay}
        onVolumeChange={handleVolume}
      />
    </div>
  );
}

export default App;