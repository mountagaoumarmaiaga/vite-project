import React from 'react';
import { PieChart, Files, FileText, Calendar } from 'lucide-react';
import { DocumentStats, DocumentType } from '../types';

interface StatsProps {
  stats: DocumentStats;
}

const typeColors: Record<DocumentType, string> = {
  invoice: 'text-yellow-500 dark:text-yellow-400',
  contract: 'text-blue-500 dark:text-blue-400',
  report: 'text-green-500 dark:text-green-400',
  other: 'text-gray-500 dark:text-gray-400'
};

const typeLabels: Record<DocumentType, string> = {
  invoice: 'Factures',
  contract: 'Contrats',
  report: 'Rapports',
  other: 'Autres'
};

export function Stats({ stats }: StatsProps) {
  const totalClassified = Object.values(stats.byType).reduce((a, b) => a + b, 0);
  const percentageClassified = stats.total > 0 ? (totalClassified / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <Files className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-500 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documents Classifiés</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalClassified}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ({percentageClassified.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Types Différents</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Object.keys(stats.byType).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aujourd'hui</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Répartition par Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <FileText className={`w-5 h-5 ${typeColors[type as DocumentType]}`} />
                <span className="font-medium text-gray-900 dark:text-white">{typeLabels[type as DocumentType]}</span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                      {count} documents
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
                      {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      type === 'invoice' ? 'bg-yellow-500 dark:bg-yellow-600' :
                      type === 'contract' ? 'bg-blue-500 dark:bg-blue-600' :
                      type === 'report' ? 'bg-green-500 dark:bg-green-600' :
                      'bg-gray-500 dark:bg-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}