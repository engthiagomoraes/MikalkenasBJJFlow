import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'cards' | 'table';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  cardsLabel?: string;
  tableLabel?: string;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  mode,
  onChange,
  cardsLabel = 'Visualização Atual',
  tableLabel = 'Visualização em Lista',
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => onChange('cards')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          mode === 'cards'
            ? 'bg-white text-slate-900 shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title={cardsLabel}
      >
        <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
        <span>{cardsLabel}</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('table')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          mode === 'table'
            ? 'bg-white text-slate-900 shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title={tableLabel}
      >
        <List className="w-3.5 h-3.5 text-blue-600" />
        <span>{tableLabel}</span>
      </button>
    </div>
  );
};
