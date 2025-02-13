import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileUpload } from './components/FileUpload';
import { Stats } from './components/Stats';
import { Document, DocumentType, FileClass } from './types';
import { FileBox, Folder, Sun, Moon, Monitor } from 'lucide-react';
import { DocumentFolder } from './pages/DocumentsFolder';
import { Modal } from './components/Modal';

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FileClass | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  // Gérer le changement de thème
  const handleThemeChange = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }

    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }, []);

  // Écouter les changements de préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        handleThemeChange('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme, handleThemeChange]);

  const getFileClass = (fileName: string): FileClass => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'excel';
    if (extension === 'pdf') return 'pdf';
    if (['txt', 'rtf'].includes(extension)) return 'text';
    return 'other';
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    const newDocs: Document[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'other',
      fileClass: getFileClass(file.name),
      uploadDate: new Date(),
      size: file.size,
      status: 'analyzing'
    }));

    setDocuments(prev => [...prev, ...newDocs]);

    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.status === 'analyzing' 
            ? { ...doc, status: 'classified', type: ['invoice', 'contract', 'report', 'other'][Math.floor(Math.random() * 4)] as DocumentType }
            : doc
        )
      );
      setIsUploading(false);
    }, 2000);
  }, []);

  const stats = {
    total: documents.length,
    byType: documents.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<DocumentType, number>),
    byFileClass: documents.reduce((acc, doc) => {
      acc[doc.fileClass] = (acc[doc.fileClass] || 0) + 1;
      return acc;
    }, {} as Record<FileClass, number>)
  };

  const folderTitles: Record<FileClass, string> = {
    pdf: 'Documents PDF',
    word: 'Documents Word',
    excel: 'Fichiers Excel',
    text: 'Fichiers Texte',
    other: 'Autres Fichiers'
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileBox className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Classification de Documents
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-2 rounded-md transition-colors ${
                  theme === 'light'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title="Mode clair"
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-2 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title="Mode sombre"
              >
                <Moon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-2 rounded-md transition-colors ${
                  theme === 'system'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title="Préférences système"
              >
                <Monitor className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-8">
            <Stats stats={stats} />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Télécharger des Documents
              </h2>
              <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['pdf', 'word', 'excel', 'text', 'other'] as FileClass[]).map((type) => (
                <FolderButton
                  key={type}
                  type={type}
                  count={stats.byFileClass[type] || 0}
                  onClick={() => setSelectedFolder(type)}
                />
              ))}
            </div>

            <Modal
              isOpen={selectedFolder !== null}
              onClose={() => setSelectedFolder(null)}
              title={selectedFolder ? folderTitles[selectedFolder] : ''}
            >
              {selectedFolder && <DocumentFolder documents={documents} fileClass={selectedFolder} />}
            </Modal>
          </div>
        </div>
      </div>
    </Router>
  );
}

interface FolderButtonProps {
  type: FileClass;
  count: number;
  onClick: () => void;
}

function FolderButton({ type, count, onClick }: FolderButtonProps) {
  const labels: Record<FileClass, string> = {
    pdf: 'Documents PDF',
    word: 'Documents Word',
    excel: 'Fichiers Excel',
    text: 'Fichiers Texte',
    other: 'Autres Fichiers'
  };

  return (
    <button
      onClick={onClick}
      className="block w-full p-6 rounded-lg transition-all bg-white dark:bg-gray-800 shadow hover:shadow-md hover:scale-105"
    >
      <div className="flex items-center gap-3">
        <Folder className={`w-8 h-8 ${
          type === 'pdf' ? 'text-red-500 dark:text-red-400' :
          type === 'word' ? 'text-blue-600 dark:text-blue-400' :
          type === 'excel' ? 'text-green-600 dark:text-green-400' :
          type === 'text' ? 'text-gray-600 dark:text-gray-400' :
          'text-gray-400 dark:text-gray-500'
        }`} />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white text-left">{labels[type]}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
            {count} document{count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </button>
  );
}

export default App;