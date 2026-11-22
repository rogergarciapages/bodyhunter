'use client';

import React from 'react';
import { useCaseStore } from '../lib/store/useCaseStore';

export const VERSIONS_LIST = [
  { id: 'all', label: 'Todas las evidencias', badge: 'Global' },
  { id: 'judicial', label: 'Sentencia Judicial', badge: 'Oficial' },
  { id: 'river', label: '1. Río Guadalquivir', badge: '2009' },
  { id: 'waste', label: '2. Vertedero Utrera', badge: '2009' },
  { id: 'majaloba', label: '3. Finca Majaloba', badge: '2013' },
  { id: 'camas', label: '4. Ruta de Camas', badge: '2011' },
];

export default function VersionSelector() {
  const selectedVersion = useCaseStore((state) => state.selectedVersion);
  const setSelectedVersion = useCaseStore((state) => state.setSelectedVersion);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {VERSIONS_LIST.map((ver) => {
        const isSelected = selectedVersion === ver.id;
        return (
          <button
            key={ver.id}
            onClick={() => setSelectedVersion(ver.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
              isSelected
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <span>{ver.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {ver.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
