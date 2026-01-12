export interface PdfDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy: () => void;
}

export interface PdfPage {
  view: number[];
  getViewport: (params: { scale: number }) => PdfViewport;
  render: (params: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }) => { promise: Promise<void> };
  getTextContent: () => Promise<TextContent>;
}

export interface PdfViewport {
  width: number;
  height: number;
  scale: number;
}

export interface TextContent {
  items: Array<{ str: string }>;
}

export interface TranslationState {
  [key: string]: string; // Cache translations per page+direction+mode
}

export type LanguageDirection = 'da-en' | 'en-da';

export type TranslationMode = 'academic' | 'general';

export enum AppState {
  IDLE = 'IDLE',
  LOADING_PDF = 'LOADING_PDF',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}