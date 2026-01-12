import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, Settings, Key, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onFileSelect: (file: File) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

// STRATEGY: Try local paths first, but fail-safe to a cute Pomeranian.
const BG_CANDIDATES = [
  '/cat.JPG',   // 1. Try absolute root path
  '../cat.JPG', // 2. Try relative path
  'cat.JPG',    // 3. Try current folder
  '/cat.jpg',   // 4. Try lowercase root
  // 5. Fail-safe: A cute, high-contrast Pomeranian puppy that looks great on dark mode
  'https://images.unsplash.com/photo-1563496336336-e2a22830f027?q=80&w=2600&auto=format&fit=crop' 
];

export const Hero: React.FC<HeroProps> = ({ onFileSelect, onOpenSettings, hasApiKey }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [bgImage, setBgImage] = useState<string>(BG_CANDIDATES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isManualImage, setIsManualImage] = useState(false);

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
      setCurrentCandidateIndex(nextIndex);
      setBgImage(BG_CANDIDATES[nextIndex]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none bg-[#050505]">
        <img 
            key={bgImage} 
            src={bgImage} 
            alt="Background" 
            className={`w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ${
                isLoaded ? 'opacity-60' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
        />
        
        {/* Loading / Error Fallback Gradient */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gray via-brand-dark to-black transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Cinematic Overlays - Adjusted for better text contrast over the bright puppy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/30" /> 
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

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-6xl w-full text-center space-y-10 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-black/30 backdrop-blur-md text-xs font-bold tracking-wider text-brand-accent mb-2 animate-float">
          <Sparkles className="w-3 h-3 text-brand-warm" />
          <span>GEMINI 3.0 FLASH POWERED</span>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight text-white leading-[0.9] drop-shadow-2xl">
          NORDIC<span className="text-brand-accent">LINK</span>
          <br/>
          <span className="text-4xl md:text-6xl lg:text-7xl font-light text-white/60 tracking-normal block mt-2">
            AI TRANSLATOR
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-lg">
          Transform Danish academic PDFs into clear English with <span className="text-white font-bold">split-screen precision</span>. Secure, client-side, and privacy-focused.
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

      {/* Footer Info */}
      <div className="absolute bottom-8 w-full flex justify-center items-center gap-6 text-white/30 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase z-20">
        <span className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-brand-accent rounded-full"></div> 
           Client Side
        </span>
        <span className="w-px h-3 bg-white/10"></span>
        <span className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-brand-purple rounded-full"></div> 
           Zero Latency
        </span>
        <span className="w-px h-3 bg-white/10"></span>
        <span className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-brand-warm rounded-full"></div> 
           Hygge Mode
        </span>
      </div>
    </div>
  );
};