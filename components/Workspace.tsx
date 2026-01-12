import React, { useState, useEffect } from 'react';
import { PdfDocument, PdfPage, TranslationState } from '../types';
import { PdfViewer } from './PdfViewer';
import { translateText } from '../services/geminiService';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, X, Loader2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface WorkspaceProps {
  pdfFile: File;
  onClose: () => void;
}

// Global variable to access PDFJS
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const Workspace: React.FC<WorkspaceProps> = ({ pdfFile, onClose }) => {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [translation, setTranslation] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationCache, setTranslationCache] = useState<TranslationState>({});
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage

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

      // Check cache first
      if (translationCache[pageNumber]) {
        setTranslation(translationCache[pageNumber]);
        return;
      }

      setIsTranslating(true);
      setTranslation(''); // Clear previous while loading

      try {
        const page: PdfPage = await pdfDoc.getPage(pageNumber);
        const textContent = await page.getTextContent();
        
        // Basic reconstruction of text
        const text = textContent.items.map((item) => item.str).join(' ');
        
        const translated = await translateText(text);
        
        setTranslation(translated);
        setTranslationCache(prev => ({ ...prev, [pageNumber]: translated }));
      } catch (err) {
        console.error("Translation logic error:", err);
        setTranslation("Error processing document text.");
      } finally {
        setIsTranslating(false);
      }
    };

    processPage();
  }, [pageNumber, pdfDoc]);

  const handlePrev = () => setPageNumber(p => Math.max(1, p - 1));
  const handleNext = () => setPageNumber(p => Math.min(totalPages, p + 1));

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
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose} className="!p-2 !rounded-lg">
            <X className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight truncate max-w-xs">{pdfFile.name}</h2>
            <p className="text-xs text-white/40 font-mono">DANISH DETECTED</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <Button variant="ghost" onClick={handlePrev} disabled={pageNumber <= 1} className="!p-2 !h-8 !w-8 !rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-mono text-sm px-2 text-white/70">
             {pageNumber} / {totalPages}
          </span>
          <Button variant="ghost" onClick={handleNext} disabled={pageNumber >= totalPages} className="!p-2 !h-8 !w-8 !rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="!p-2">
             <ZoomOut className="w-4 h-4" />
           </Button>
           <Button variant="ghost" onClick={() => setScale(s => Math.min(3, s + 0.2))} className="!p-2">
             <ZoomIn className="w-4 h-4" />
           </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: PDF Original */}
        <div className="h-full bg-[#151515] relative transition-all duration-300" style={{ width: `${splitRatio}%` }}>
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-white/10 text-white/60">
            ORIGINAL
          </div>
          <PdfViewer pdfDocument={pdfDoc} pageNumber={pageNumber} scale={scale} />
        </div>

        {/* Resizer Handle (Visual only for now, could be made interactive) */}
        <div className="w-1 bg-[#2a2a2a] hover:bg-brand-accent cursor-col-resize z-30 transition-colors" />

        {/* Right: AI Translation */}
        <div className="h-full bg-brand-dark flex-1 overflow-y-auto relative p-8 md:p-12 border-l border-white/5" style={{ width: `${100 - splitRatio}%` }}>
           <div className="absolute top-4 left-4 z-10 bg-brand-accent/10 backdrop-blur text-xs font-mono px-2 py-1 rounded border border-brand-accent/20 text-brand-accent">
            AI TRANSLATED
          </div>

          <div className="max-w-3xl mx-auto mt-6">
            {isTranslating ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                <div className="h-32 bg-white/5 rounded border border-white/5"></div>
                <div className="flex items-center gap-2 text-brand-accent text-sm font-mono mt-4">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Translating via Gemini 3.0...</span>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert prose-lg max-w-none">
                 {/* Simple Markdown Rendering */}
                 {translation.split('\n').map((line, idx) => (
                   <p key={idx} className="mb-4 text-gray-300 leading-relaxed font-light">
                     {line}
                   </p>
                 ))}
              </div>
            )}
            
            {!isTranslating && !translation && (
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