import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Workspace } from './components/Workspace';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.VIEWING);
  };

  const handleClose = () => {
    setCurrentFile(null);
    setAppState(AppState.IDLE);
  };

  return (
    <main className="w-full h-full min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-black">
      {appState === AppState.IDLE && (
        <Hero onFileSelect={handleFileSelect} />
      )}
      
      {appState === AppState.VIEWING && currentFile && (
        <Workspace pdfFile={currentFile} onClose={handleClose} />
      )}

      {/* API Key Warning Overlay (Only if env is missing, for demo robustness) */}
      {!process.env.API_KEY && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-red-900/20 border border-red-500/50 p-4 rounded-lg backdrop-blur-md z-50">
          <h4 className="text-red-400 font-bold text-sm mb-1">Missing API Key</h4>
          <p className="text-xs text-red-200/70">
            Please ensure <code>process.env.API_KEY</code> is set to use the Gemini Translation service.
          </p>
        </div>
      )}
    </main>
  );
};

export default App;