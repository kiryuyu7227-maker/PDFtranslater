import React, { useEffect, useRef } from 'react';
import { PdfDocument, PdfPage } from '../types';

interface PdfViewerProps {
  pdfDocument: PdfDocument | null;
  pageNumber: number;
  scale?: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfDocument, pageNumber, scale = 1.5 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current || !wrapperRef.current) return;

      try {
        const page: PdfPage = await pdfDocument.getPage(pageNumber);
        
        // Calculate scale to fit width if needed, or use default
        const wrapperWidth = wrapperRef.current.clientWidth;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const fitScale = (wrapperWidth - 40) / unscaledViewport.width; // -40 for padding
        const finalScale = Math.min(fitScale, scale);

        const viewport = page.getViewport({ scale: finalScale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (!isCancelled) {
            await page.render({
              canvasContext: context,
              viewport: viewport,
            }).promise;
          }
        }
      } catch (error) {
        console.error("Error rendering PDF page:", error);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDocument, pageNumber, scale]);

  return (
    <div ref={wrapperRef} className="w-full flex justify-center items-start overflow-auto h-full p-4 bg-[#0a0a0a]">
      <canvas 
        ref={canvasRef} 
        className="shadow-2xl shadow-black border border-white/10 rounded-sm"
      />
    </div>
  );
};