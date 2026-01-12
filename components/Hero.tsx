import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, Settings, Key, Image as ImageIcon, Linkedin, Globe, User } from 'lucide-react';
import { Button } from './Button';
import { AboutModal } from './AboutModal';

interface HeroProps {
  onFileSelect: (file: File) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

// STRATEGY: 
// 1. Try Local Files (cat.JPG)
// 2. Try Unsplash (High Quality)
// 3. Try Pexels (Backup for regions where Unsplash might be slow/blocked)
const BG_CANDIDATES = [
  '/cat.JPG',    // Root path (Best bet for Vite/Public)
  'cat.JPG',     // Relative path
  './cat.JPG',   // Explicit relative
  // Unsplash: Cute Pomeranian (Black background friendly)
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop', 
  // Pexels: Backup White Dog (High availability CDN)
  'https://images.pexels.com/photos/33053/dog-young-dog-small-dog-maltese.jpg?auto=compress&cs=tinysrgb&w=1600'
];

export const Hero: React.FC<HeroProps> = ({ onFileSelect, onOpenSettings, hasApiKey }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [bgImage, setBgImage] = useState<string>(BG_CANDIDATES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isManualImage, setIsManualImage] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleBgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.name.toLowerCase().endsWith('.heic')) {
          alert("Warning: HEIC files are not supported by browsers. Please use JPG or PNG.");
      }

      const imageUrl = URL.createObjectURL(file);
      setBgImage(imageUrl);
      setIsManualImage(true);
      setIsLoaded(false); 
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    if (isManualImage) return; 

    const nextIndex = currentCandidateIndex + 1;
    if (nextIndex < BG_CANDIDATES.length) {
      console.log(`Image failed: ${bgImage}. Trying next candidate...`);
      setIsLoaded(false); // Reset opacity for the new image
      setCurrentCandidateIndex(nextIndex);
      setBgImage(BG_CANDIDATES[nextIndex]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* --- BACKGROUND LAYER --- */}
      {/* Fallback CSS Gradient (Visible if image fails to load or during loading) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#000000] z-0" />

      <div className="absolute inset-0 z-0 select-none">
        <img 
            key={bgImage} 
            src={bgImage} 
            alt="Background" 
            className={`w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ${
                isLoaded ? 'opacity-50' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent" />
        {/* Darken overlay to ensure text pops against white dogs */}
        <div className="absolute inset-0 bg-black/40" /> 
      </div>

      {/* --- NAVIGATION --- */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <div className="relative group">
            <Button 
            variant="secondary" 
            onClick={() => bgInputRef.current?.click()} 
            className="!px-3 !py-2.5 !bg-black/40 !backdrop-blur-xl border-white/10 hover:!bg-white/10"
            title="Change Background Image"
            >
            <ImageIcon className="w-4 h-4 text-white/70" />
            </Button>
        </div>
        
        <input 
            type="file" 
            ref={bgInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleBgSelect} 
        />

        <Button 
          variant="secondary" 
          onClick={onOpenSettings} 
          className="!px-5 !py-2.5 !text-sm !bg-black/40 !backdrop-blur-xl border-white/10 hover:!bg-white/10 transition-all"
          icon={hasApiKey ? <Settings className="w-4 h-4" /> : <Key className="w-4 h-4 text-brand-accent" />}
        >
          {hasApiKey ? 'Settings' : 'Set API Key'}
        </Button>
      </div>

      {/* --- CONTENT CONTAINER (FLEX) --- */}
      {/* This ensures vertical centering but allows scrolling/stacking if height is small */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 pt-24 z-10">
        <div className="max-w-6xl w-full text-center space-y-10 flex flex-col items-center">
          
          {/* Main Title (Banner Removed) */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight text-white leading-[0.9] drop-shadow-2xl mt-12">
            NORDIC<span className="text-brand-accent">LINK</span>
            <br/>
            <span className="text-4xl md:text-6xl lg:text-7xl font-light text-white/60 tracking-normal block mt-2">
              AI TRANSLATOR
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-lg">
            High-precision PDF translation supporting <span className="text-white font-bold">English, Danish, Japanese, and Chinese</span>. Secure, client-side, and privacy-focused.
          </p>

          {/* Upload Card */}
          <div 
            className="mt-8 group relative w-full max-w-xl mx-auto perspective-1000"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent via-brand-purple to-brand-warm rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            
            <div className="relative glass-panel rounded-[1.8rem] p-10 md:p-14 flex flex-col items-center gap-8 transition duration-500 group-hover:scale-[1.01] group-hover:bg-black/50">
              <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-display font-bold text-white">Upload Document</h3>
                <p className="text-white/50 text-sm font-medium">Drag & drop PDF or click to browse</p>
              </div>

              <Button 
                onClick={() => {
                  if (!hasApiKey) {
                    onOpenSettings();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="w-full max-w-xs !h-14 !text-lg !font-bold shadow-xl shadow-brand-accent/10"
                icon={<FileText className="w-5 h-5" />}
              >
                {hasApiKey ? 'Select PDF File' : 'Set API Key First'}
              </Button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf" 
                onChange={(e) => {
                  if(e.target.files?.[0]) onFileSelect(e.target.files[0]);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info / Personal Branding - TRIPLE CARD LAYOUT */}
      {/* Changed from absolute to relative margin-based layout to prevent overlap */}
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 z-20 p-6 pb-10 mt-8">
        
        {/* Card 1: LinkedIn */}
        <a 
          href="https://www.linkedin.com/in/yukiryu/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/60 border border-[#0077b5]/30 shadow-[0_0_15px_rgba(0,119,181,0.1)] hover:shadow-[0_0_25px_rgba(0,119,181,0.4)] hover:bg-black/80 hover:border-[#0077b5] transition-all duration-300 backdrop-blur-md w-full md:w-auto max-w-xs justify-start md:justify-center transform hover:-translate-y-1"
        >
          <div className="bg-[#0077b5] p-1.5 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
             <Linkedin className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-widest text-[#0077b5] uppercase leading-none mb-0.5 group-hover:text-white/60 transition-colors">
              Connect
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              LinkedIn
            </span>
          </div>
        </a>

        {/* Card 2: About Me */}
        <button 
          onClick={() => setIsAboutOpen(true)}
          className="group flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/60 border border-brand-warm/30 shadow-[0_0_15px_rgba(255,179,71,0.1)] hover:shadow-[0_0_25px_rgba(255,179,71,0.4)] hover:bg-black/80 hover:border-brand-warm transition-all duration-300 backdrop-blur-md w-full md:w-auto max-w-xs justify-start md:justify-center transform hover:-translate-y-1"
        >
          <div className="bg-brand-warm p-1.5 rounded-full text-black shadow-lg group-hover:scale-110 transition-transform duration-300">
             <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-widest text-brand-warm uppercase leading-none mb-0.5 group-hover:text-white/60 transition-colors">
              Developer
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              About Me
            </span>
          </div>
        </button>

        {/* Card 3: Portfolio */}
        <a 
          href="https://kiryuyu7227-maker.github.io/portfolio/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/60 border border-brand-purple/30 shadow-[0_0_15px_rgba(112,0,255,0.1)] hover:shadow-[0_0_25px_rgba(112,0,255,0.4)] hover:bg-black/80 hover:border-brand-purple transition-all duration-300 backdrop-blur-md w-full md:w-auto max-w-xs justify-start md:justify-center transform hover:-translate-y-1"
        >
          <div className="bg-brand-purple p-1.5 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
             <Globe className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-widest text-brand-purple uppercase leading-none mb-0.5 group-hover:text-white/60 transition-colors">
              Portfolio
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              Website
            </span>
          </div>
        </a>

      </div>
    </div>
  );
};