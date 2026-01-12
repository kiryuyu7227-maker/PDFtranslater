import React, { useRef } from 'react';
import { Upload, ArrowRight, FileText } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onFileSelect: (file: File) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono text-brand-accent mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          GEMINI 3.0 FLASH POWERED
        </div>

        <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[0.9]">
          DANISH<br/>
          <span className="text-stroke text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>TO ENGLISH</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          Experience document translation reimaged. High-fidelity PDF rendering with split-screen AI translation specifically tuned for Danish academic and technical documents.
        </p>

        <div 
          className="mt-12 group relative w-full max-w-xl mx-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-purple rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col items-center gap-6 transition duration-300 hover:border-white/20 hover:bg-[#141414]">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-8 h-8 text-white/80" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-medium text-white">Upload Document</h3>
              <p className="text-white/40 text-sm">Drag & drop your PDF or click to browse</p>
            </div>

            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-xs"
              icon={<FileText className="w-4 h-4" />}
            >
              Select PDF
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

      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-8 text-white/20 text-xs font-mono uppercase tracking-widest">
        <span>Privacy First</span>
        <span>•</span>
        <span>Local Rendering</span>
        <span>•</span>
        <span>Neural Translation</span>
      </div>
    </div>
  );
};