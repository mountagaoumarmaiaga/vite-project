export type FileClass = 'pdf' | 'word' | 'excel' | 'text' | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileClass: FileClass;
  uploadDate: Date;
  size: number;
  status: 'analyzing' | 'classified' | 'error';
}

export type DocumentType = 'invoice' | 'contract' | 'report' | 'other';

export interface DocumentStats {
  total: number;
  byType: Record<DocumentType, number>;
  byFileClass: Record<FileClass, number>;
}