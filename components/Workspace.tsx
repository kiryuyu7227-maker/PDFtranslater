import React, { useState, useEffect } from 'react';
import { PdfDocument, PdfPage, TranslationState, TranslationMode, LanguageCode, SUPPORTED_LANGUAGES } from '../types';
import { PdfViewer } from './PdfViewer';
import { translateText } from '../services/geminiService';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, X, Loader2, RefreshCw, ZoomIn, ZoomOut, ArrowRightLeft, Settings, AlertCircle, Sparkles, GraduationCap, MessageCircle, ArrowRight } from 'lucide-react';

interface WorkspaceProps {
  pdfFile: File;
  onClose: () => void;
  apiKey: string;
  onOpenSettings: () => void;
}

// Global variable to access PDFJS
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const Workspace: React.FC<WorkspaceProps> = ({ pdfFile, onClose, apiKey, onOpenSettings }) => {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [translation, setTranslation] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationCache, setTranslationCache] = useState<TranslationState>({});
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage
  
  // Language State
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('da');
  
  const [mode, setMode] = useState<TranslationMode>('academic');
  const [errorState, setErrorState] = useState<'NONE' | 'API_KEY' | 'GENERIC'>('NONE');

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      } catch (error) {
        console.error("Failed to load PDF:", error);
      }
    };
    loadPdf();
  }, [pdfFile]);

  // Extract Text & Translate
  useEffect(() => {
    const processPage = async () => {
      if (!pdfDoc) return;

      // Cache key includes source, target, and mode
      const cacheKey = `${pageNumber}-${sourceLang}-${targetLang}-${mode}`;

      // Check cache first
      if (translationCache[cacheKey]) {
        setTranslation(translationCache[cacheKey]);
        setErrorState('NONE');
        return;
      }

      setIsTranslating(true);
      setTranslation(''); // Clear previous while loading
      setErrorState('NONE');

      try {
        const page: PdfPage = await pdfDoc.getPage(pageNumber);
        const textContent = await page.getTextContent();
        
        // Basic reconstruction of text
        const text = textContent.items.map((item) => item.str).join(' ');
        
        // Pass sourceLang and targetLang
        const translated = await translateText(text, sourceLang, targetLang, mode, apiKey);
        
        setTranslation(translated);
        setTranslationCache(prev => ({ ...prev, [cacheKey]: translated }));
      } catch (err: any) {
        console.error("Translation logic error:", err);
        if (err.message === 'INVALID_API_KEY' || err.message === 'MISSING_API_KEY') {
           setErrorState('API_KEY');
        } else {
           setErrorState('GENERIC');
        }
      } finally {
        setIsTranslating(false);
      }
    };

    processPage();
  }, [pageNumber, pdfDoc, sourceLang, targetLang, apiKey, mode]);

  const handlePrev = () => setPageNumber(p => Math.max(1, p - 1));
  const handleNext = () => setPageNumber(p => Math.min(totalPages, p + 1));
  
  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  if (!pdfDoc) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-dark text-white">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
        <span className="ml-4 font-display text-xl">Loading Document...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-brand-dark text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} className="!p-2 !rounded-lg">
            <X className="w-5 h-5" />
          </Button>
          <div className="flex flex-col gap-1">
            <h2 className="font-display font-bold text-lg leading-none truncate max-w-[150px] md:max-w-[200px]">{pdfFile.name}</h2>
            
            {/* Controls Row - Redesigned for Dropdowns */}
            <div className="flex items-center gap-2">
                
                {/* Language Selectors */}
                <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
                    <select 
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value as LanguageCode)}
                        className="bg-transparent text-[11px] md:text-xs font-mono uppercase text-center w-16 md:w-20 outline-none cursor-pointer hover:text-brand-accent transition-colors py-1"
                        title="Source Language"
                    >
                        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                            <option key={code} value={code}>{lang.label}</option>
                        ))}
                    </select>

                    <button 
                        onClick={handleSwapLanguages}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-brand-accent mx-0.5"
                        title="Swap Languages"
                    >
                        <ArrowRightLeft className="w-3 h-3" />
                    </button>

                    <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
                        className="bg-transparent text-[11px] md:text-xs font-mono uppercase text-center w-16 md:w-20 outline-none cursor-pointer hover:text-brand-accent transition-colors py-1"
                        title="Target Language"
                    >
                         {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                            <option key={code} value={code}>{lang.label}</option>
                        ))}
                    </select>
                </div>

                <div className="w-px h-3 bg-white/20 hidden sm:block"></div>

                {/* Mode Toggle */}
                <div className="flex bg-white/5 rounded-md p-0.5 hidden sm:flex">
                    <button
                        onClick={() => setMode('academic')}
                        className={`px-2 py-0.5 text-[10px] md:text-xs rounded flex items-center gap-1 transition-all ${mode === 'academic' ? 'bg-brand-purple text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                        title="Academic Mode: Preserves Math & Formulas"
                    >
                        <GraduationCap className="w-3 h-3" />
                        <span className="hidden md:inline">Academic</span>
                    </button>
                    <button
                        onClick={() => setMode('general')}
                        className={`px-2 py-0.5 text-[10px] md:text-xs rounded flex items-center gap-1 transition-all ${mode === 'general' ? 'bg-brand-warm text-black font-medium shadow-sm' : 'text-white/40 hover:text-white'}`}
                        title="General Mode: Natural & Fluent"
                    >
                        <MessageCircle className="w-3 h-3" />
                        <span className="hidden md:inline">General</span>
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 mx-2">
          <Button variant="ghost" onClick={handlePrev} disabled={pageNumber <= 1} className="!p-2 !h-8 !w-8 !rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-mono text-sm px-2 text-white/70 whitespace-nowrap">
             {pageNumber} / {totalPages}
          </span>
          <Button variant="ghost" onClick={handleNext} disabled={pageNumber >= totalPages} className="!p-2 !h-8 !w-8 !rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
           <Button variant="ghost" onClick={onOpenSettings} className="!p-2 !text-white/40 hover:!text-white hidden md:flex">
             <Settings className="w-4 h-4" />
           </Button>
           <div className="w-px h-4 bg-white/10 mx-1 hidden md:block"></div>
           <Button variant="ghost" onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="!p-2 hidden sm:flex">
             <ZoomOut className="w-4 h-4" />
           </Button>
           <Button variant="ghost" onClick={() => setScale(s => Math.min(3, s + 0.2))} className="!p-2 hidden sm:flex">
             <ZoomIn className="w-4 h-4" />
           </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: PDF Original */}
        <div className="h-full bg-[#151515] relative transition-all duration-300" style={{ width: `${splitRatio}%` }}>
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-white/10 text-white/60 pointer-events-none">
            ORIGINAL
          </div>
          <PdfViewer pdfDocument={pdfDoc} pageNumber={pageNumber} scale={scale} />
        </div>

        {/* Resizer Handle (Visual only for now, could be made interactive) */}
        <div className="w-1 bg-[#2a2a2a] hover:bg-brand-accent cursor-col-resize z-30 transition-colors hidden md:block" />

        {/* Right: AI Translation */}
        <div className="h-full bg-brand-dark flex-1 overflow-y-auto relative p-6 md:p-12 border-l border-white/5" style={{ width: `${100 - splitRatio}%` }}>
           <div className="absolute top-4 left-4 z-10 flex gap-2">
               <div className="bg-brand-accent/10 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-brand-accent/20 text-brand-accent uppercase pointer-events-none flex items-center gap-2">
                    {SUPPORTED_LANGUAGES[targetLang].label} Output
               </div>
               {mode === 'academic' && (
                    <div className="bg-brand-purple/10 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-brand-purple/20 text-brand-purple flex items-center gap-1 pointer-events-none">
                        <GraduationCap className="w-3 h-3" /> Academic
                    </div>
               )}
               {mode === 'general' && (
                    <div className="bg-brand-warm/10 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-brand-warm/20 text-brand-warm flex items-center gap-1 pointer-events-none">
                        <MessageCircle className="w-3 h-3" /> General
                    </div>
               )}
           </div>

          <div className="max-w-3xl mx-auto mt-8">
            {isTranslating && (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                <div className="h-32 bg-white/5 rounded border border-white/5"></div>
                <div className="flex items-center gap-2 text-brand-accent text-sm font-mono mt-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Translating {SUPPORTED_LANGUAGES[sourceLang].label} to {SUPPORTED_LANGUAGES[targetLang].label}...</span>
                </div>
              </div>
            )}

            {!isTranslating && errorState === 'API_KEY' && (
               <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Authentication Error</h3>
                  <p className="text-white/60 text-sm mb-6 max-w-sm">
                    Your Google Gemini API Key appears to be invalid, expired, or missing permissions.
                  </p>
                  <Button onClick={onOpenSettings} variant="secondary">
                    Update API Key
                  </Button>
               </div>
            )}

            {!isTranslating && errorState === 'GENERIC' && (
               <div className="flex flex-col items-center justify-center h-64 text-center text-white/50">
                  <p>Translation service temporarily unavailable.</p>
                  <Button onClick={() => window.location.reload()} variant="ghost" className="mt-4">Reload App</Button>
               </div>
            )}

            {!isTranslating && errorState === 'NONE' && translation && (
              <div className="prose prose-invert prose-lg max-w-none">
                 {/* Simple Markdown Rendering */}
                 {translation.split('\n').map((line, idx) => (
                   <p key={idx} className="mb-4 text-gray-300 leading-relaxed font-light">
                     {line}
                   </p>
                 ))}
              </div>
            )}
            
            {!isTranslating && errorState === 'NONE' && !translation && (
               <div className="flex flex-col items-center justify-center h-64 text-white/30">
                 <p>No text detected on this page.</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};