import React, { useState } from 'react';
import { FileText, FileCheck, AlertCircle, Search, Filter, FileSpreadsheet, WholeWord as FileWord } from 'lucide-react';
import { Document, DocumentType, FileClass } from '../types';

interface DocumentListProps {
  documents: Document[];
}

const typeIcons: Record<DocumentType, JSX.Element> = {
  invoice: <FileText className="w-5 h-5 text-yellow-500" />,
  contract: <FileText className="w-5 h-5 text-blue-500" />,
  report: <FileText className="w-5 h-5 text-green-500" />,
  other: <FileText className="w-5 h-5 text-gray-500" />
};

const fileClassIcons: Record<FileClass, JSX.Element> = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  word: <FileWord className="w-5 h-5 text-blue-600" />,
  excel: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
  text: <FileText className="w-5 h-5 text-gray-600" />,
  other: <FileText className="w-5 h-5 text-gray-400" />
};

const typeLabels: Record<DocumentType, string> = {
  invoice: 'Facture',
  contract: 'Contrat',
  report: 'Rapport',
  other: 'Autre'
};

const fileClassLabels: Record<FileClass, string> = {
  pdf: 'PDF',
  word: 'Word',
  excel: 'Excel',
  text: 'Texte',
  other: 'Autre'
};

export function DocumentList({ documents }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [selectedFileClass, setSelectedFileClass] = useState<FileClass | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'fileClass'>('date');

  const filteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === 'all' || doc.type === selectedType) &&
      (selectedFileClass === 'all' || doc.fileClass === selectedFileClass)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'fileClass':
          return a.fileClass.localeCompare(b.fileClass);
        default:
          return 0;
      }
    });

  // Grouper les documents par classe de fichier
  const groupedByFileClass = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.fileClass]) {
      acc[doc.fileClass] = [];
    }
    acc[doc.fileClass].push(doc);
    return acc;
  }, {} as Record<FileClass, Document[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DocumentType | 'all')}
            >
              <option value="all">Tous les types</option>
              <option value="invoice">Factures</option>
              <option value="contract">Contrats</option>
              <option value="report">Rapports</option>
              <option value="other">Autres</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedFileClass}
              onChange={(e) => setSelectedFileClass(e.target.value as FileClass | 'all')}
            >
              <option value="all">Tous les formats</option>
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
              <option value="excel">Excel</option>
              <option value="text">Texte</option>
              <option value="other">Autres</option>
            </select>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'type' | 'fileClass')}
          >
            <option value="date">Trier par date</option>
            <option value="name">Trier par nom</option>
            <option value="type">Trier par type</option>
            <option value="fileClass">Trier par format</option>
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedByFileClass).map(([fileClass, docs]) => (
          <div key={fileClass} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex items-center gap-2">
              {fileClassIcons[fileClass as FileClass]}
              <h2 className="text-lg font-semibold text-gray-900">
                {fileClassLabels[fileClass as FileClass]} ({docs.length})
              </h2>
            </div>
            
            <div className="divide-y">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {typeIcons[doc.type]}
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{typeLabels[doc.type]}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'analyzing' && (
                      <span className="flex items-center text-yellow-600 text-sm bg-yellow-50 px-3 py-1 rounded-full">
                        <FileText className="w-4 h-4 mr-1" />
                        Analyse en cours...
                      </span>
                    )}
                    {doc.status === 'classified' && (
                      <span className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
                        <FileCheck className="w-4 h-4 mr-1" />
                        Classifié
                      </span>
                    )}
                    {doc.status === 'error' && (
                      <span className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Erreur
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun document ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}