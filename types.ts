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
  [pageNumber: number]: string; // Cache translations per page
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING_PDF = 'LOADING_PDF',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}