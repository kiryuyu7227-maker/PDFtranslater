import React, { useState, useEffect } from 'react';
import { Key, Save, X, Eye, EyeOff, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  initialKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, initialKey }) => {
  const [key, setKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setKey(initialKey);
  }, [initialKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#0F0F0F] border border-white/10 rounded-2xl w-full max-w-lg p-0 shadow-2xl shadow-brand-accent/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                <Key className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium text-white">Setup Gemini API</h3>
                <p className="text-xs text-white/40">Powered by Google's Gemini 3.0 Flash</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Privacy Badge */}
          <div className="flex items-start gap-3 p-3 bg-brand-accent/5 rounded-lg border border-brand-accent/10">
            <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="text-brand-accent font-medium block mb-0.5">Privacy First / BYOK Model</span>
              <span className="text-white/60 leading-tight block">
                Your API key is stored <strong>locally in your browser</strong>. We do not have servers. Your data never leaves your device except to reach Google's API.
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
             <div className="flex items-center justify-between text-sm font-medium text-white/80">
               <span>How to get a key:</span>
             </div>
             
             <ol className="relative border-l border-white/10 ml-3 space-y-6">
                <li className="ml-6">
                  <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-brand-accent ring-4 ring-[#0F0F0F]" />
                  <p className="text-sm text-white/60 mb-1">Step 1</p>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors font-medium group"
                  >
                    Open Google AI Studio <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  </a>
                </li>
                <li className="ml-6">
                  <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-white/20 ring-4 ring-[#0F0F0F]" />
                  <p className="text-sm text-white/60 mb-1">Step 2</p>
                  <p className="text-sm text-white">Click "Create API Key" and copy it.</p>
                </li>
             </ol>
          </div>

          {/* Input Area */}
          <div className="space-y-2 pt-2">
            <label className="text-xs uppercase tracking-wider text-white/40 font-mono pl-1">Enter your API Key</label>
            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Paste your key starting with AIza..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all font-mono text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {key.length > 10 && !key.startsWith('AIza') && (
              <p className="text-xs text-red-400 pl-1">Warning: Valid keys usually start with "AIza"</p>
            )}
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => onSave(key)}
              className="w-full"
              disabled={!key}
              icon={<Save className="w-4 h-4" />}
            >
              Save & Start Translating
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};