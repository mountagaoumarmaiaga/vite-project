import React, { useState } from 'react';
import { FileText, FileCheck, AlertCircle, Search, Filter } from 'lucide-react';
import { Document, DocumentType, FileClass } from '../types';

interface DocumentFolderProps {
  documents: Document[];
  fileClass: FileClass;
}

const typeLabels: Record<DocumentType, string> = {
  invoice: 'Facture',
  contract: 'Contrat',
  report: 'Rapport',
  other: 'Autre'
};

export function DocumentFolder({ documents, fileClass }: DocumentFolderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');

  const folderDocuments = documents
    .filter(doc => 
      doc.fileClass === fileClass &&
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === 'all' || doc.type === selectedType)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher des documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'type')}
          >
            <option value="date">Trier par date</option>
            <option value="name">Trier par nom</option>
            <option value="type">Trier par type</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {folderDocuments.map((doc) => (
          <div
            key={doc.id}
            className="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <FileText className={`w-6 h-6 ${
                doc.type === 'invoice' ? 'text-yellow-500 dark:text-yellow-400' :
                doc.type === 'contract' ? 'text-blue-500 dark:text-blue-400' :
                doc.type === 'report' ? 'text-green-500 dark:text-green-400' :
                'text-gray-500 dark:text-gray-400'
              }`} />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                <span className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-400/10 px-3 py-1 rounded-full">
                  <FileText className="w-4 h-4 mr-1" />
                  Analyse en cours...
                </span>
              )}
              {doc.status === 'classified' && (
                <span className="flex items-center text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-400/10 px-3 py-1 rounded-full">
                  <FileCheck className="w-4 h-4 mr-1" />
                  Classifié
                </span>
              )}
              {doc.status === 'error' && (
                <span className="flex items-center text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-400/10 px-3 py-1 rounded-full">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Erreur
                </span>
              )}
            </div>
          </div>
        ))}

        {folderDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucun document dans ce dossier ne correspond à vos critères de recherche.
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