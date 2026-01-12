import React from 'react';
import { X, MapPin, User, Code2, Heart, Briefcase } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-lg p-0 shadow-2xl shadow-brand-warm/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-24 bg-gradient-to-r from-brand-warm/20 via-brand-purple/20 to-brand-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-black/20 z-10"
            >
              <X className="w-5 h-5" />
            </button>
        </div>

        <div className="px-8 pb-8 -mt-10 relative">
            {/* Avatar / Icon */}
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-brand-warm flex items-center justify-center shadow-lg mb-6">
                <User className="w-8 h-8 text-brand-warm" />
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">Yu Kiryu</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand-accent" /> Denmark</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>Japanese (Born in China)</span>
                    </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-white/80 font-light">
                    <p>
                        Hi there! <span className="inline-block animate-pulse">👋</span>
                    </p>
                    
                    <p>
                        I previously worked in <strong>IT and major consulting firms in Japan</strong>. Due to family reasons, I relocated to Denmark, where I am currently <strong className="text-brand-accent inline-flex items-center gap-1"><Briefcase className="w-3 h-3" /> Open to Work</strong>.
                    </p>

                    <p>
                        During my career break, I dove deep into AI technology. Driven by a passion for AI tools, I utilized AI to design and build this product from scratch to solve real-world problems.
                    </p>
                    
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-3">
                        <Heart className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-white/70 text-xs">
                            My goal is to create tools that help people. Whether you are a student or a researcher, I hope this translator makes your work a little easier.
                        </p>
                    </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest font-mono">
                    <Code2 className="w-3 h-3" />
                    <span>Built with React & Gemini API</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};