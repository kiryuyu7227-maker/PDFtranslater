import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Workspace } from './components/Workspace';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  // State for API Key and Modal
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Load key from storage on mount
  // We explicitly REMOVED process.env.API_KEY fallback to ensure this is a pure BYOK (Bring Your Own Key) app.
  // This prevents the developer's key from accidentally being included in the build.
  useEffect(() => {
    const storedKey = localStorage.getItem('nordiclink_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('nordiclink_api_key', key);
    setIsSettingsOpen(false);
  };

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.VIEWING);
  };

  const handleCloseWorkspace = () => {
    setCurrentFile(null);
    setAppState(AppState.IDLE);
  };

  const hasValidKey = !!apiKey;

  return (
    <main className="w-full h-full min-h-screen bg-brand-dark text-white selection:bg-brand-accent selection:text-black">
      {appState === AppState.IDLE && (
        <Hero 
          onFileSelect={handleFileSelect} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasApiKey={hasValidKey}
        />
      )}
      
      {appState === AppState.VIEWING && currentFile && (
        <Workspace 
          pdfFile={currentFile} 
          onClose={handleCloseWorkspace} 
          apiKey={apiKey}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <ApiKeyModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveApiKey}
        initialKey={apiKey}
      />
    </main>
  );
};

export default App;