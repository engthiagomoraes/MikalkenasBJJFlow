import React from 'react';
import { BeltColor, GraduationSystemType } from '../../types';

interface BeltBadgeProps {
  faixa: BeltColor;
  graus?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  hideGraus?: boolean;
  sistemaGraduacao?: GraduationSystemType;
}

export const BELT_INFO: Record<BeltColor, { label: string; bgClass: string; textClass: string; barClass: string; stripeClass: string }> = {
  branca: {
    label: 'Branca',
    bgClass: 'bg-slate-100 border border-slate-300',
    textClass: 'text-slate-900',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  cinza: {
    label: 'Cinza (Kids)',
    bgClass: 'bg-slate-400 border border-slate-500',
    textClass: 'text-white',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  amarela: {
    label: 'Amarela (Kids)',
    bgClass: 'bg-amber-400 border border-amber-500',
    textClass: 'text-amber-950 font-bold',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  laranja: {
    label: 'Laranja (Kids)',
    bgClass: 'bg-orange-500 border border-orange-600',
    textClass: 'text-white',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  verde: {
    label: 'Verde (Kids/Juv)',
    bgClass: 'bg-emerald-600 border border-emerald-700',
    textClass: 'text-white',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  azul: {
    label: 'Azul',
    bgClass: 'bg-blue-600 border border-blue-700',
    textClass: 'text-white',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  roxa: {
    label: 'Roxa',
    bgClass: 'bg-purple-700 border border-purple-800',
    textClass: 'text-white',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  marrom: {
    label: 'Marrom',
    bgClass: 'bg-amber-900 border border-amber-950',
    textClass: 'text-amber-100',
    barClass: 'bg-black',
    stripeClass: 'bg-white'
  },
  preta: {
    label: 'Preta',
    bgClass: 'bg-neutral-900 border border-neutral-800',
    textClass: 'text-red-500 font-extrabold',
    barClass: 'bg-red-600', // Ponta vermelha de faixa preta tradicional
    stripeClass: 'bg-white'
  }
};

export const BeltBadge: React.FC<BeltBadgeProps> = ({ 
  faixa, 
  graus = 0, 
  size = 'md',
  showLabel = true,
  hideGraus = false,
  sistemaGraduacao
}) => {
  const info = BELT_INFO[faixa] || BELT_INFO.branca;
  const isApenasFaixas = sistemaGraduacao === 'apenas_faixas' || hideGraus;
  const effectiveGraus = isApenasFaixas ? 0 : graus;

  const heightClasses = {
    sm: 'h-4 text-xs px-2 gap-1.5',
    md: 'h-6 text-xs px-2.5 gap-2',
    lg: 'h-8 text-sm px-3 gap-3'
  };

  const barWidthClasses = {
    sm: isApenasFaixas ? 'w-2.5 h-3.5' : 'w-4 h-3.5',
    md: isApenasFaixas ? 'w-3.5 h-5' : 'w-6 h-5',
    lg: isApenasFaixas ? 'w-4.5 h-6' : 'w-8 h-6'
  };

  const stripeWidthClasses = {
    sm: 'w-0.5 h-3',
    md: 'w-1 h-4',
    lg: 'w-1 h-5'
  };

  return (
    <div className={`inline-flex items-center rounded-md font-semibold shadow-sm select-none ${info.bgClass} ${info.textClass} ${heightClasses[size]}`}>
      {showLabel && <span>{info.label}</span>}
      
      {/* Visual BJJ Belt Bar (Ponta Preta/Vermelha com Graus ou Lisa) */}
      <div className={`relative flex items-center justify-center rounded-xs overflow-hidden ${info.barClass} ${barWidthClasses[size]} shadow-inner`}>
        {!isApenasFaixas && (
          <div className="flex items-center gap-0.5 px-0.5 justify-center w-full">
            {Array.from({ length: effectiveGraus }).map((_, i) => (
              <div 
                key={i} 
                className={`rounded-xs ${info.stripeClass} ${stripeWidthClasses[size]}`}
                title={`${i + 1}º Grau`}
              />
            ))}
          </div>
        )}
      </div>
      
      {!isApenasFaixas && effectiveGraus > 0 && <span className="opacity-90">{effectiveGraus}º grau</span>}
      {isApenasFaixas && showLabel && <span className="text-[10px] opacity-75 font-normal">(Faixa Direta)</span>}
    </div>
  );
};
