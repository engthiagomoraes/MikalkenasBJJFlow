import React from 'react';
import { Moon, Sun, Sparkles, Check } from 'lucide-react';
import { useBjj } from '../../context/BjjContext';
import { AppTheme } from '../../types';

interface ThemeSelectorProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { theme, setTheme } = useBjj();

  const themes: {
    id: AppTheme;
    name: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgColor: string;
    preview: { primary: string; secondary: string; accent: string };
  }[] = [
    {
      id: 'dark',
      name: 'Escuro',
      subtitle: 'Onyx Tatame • Modo Escuro',
      icon: Moon,
      accentColor: '#3B82F6',
      bgColor: '#080C14',
      preview: { primary: '#080C14', secondary: '#121927', accent: '#3B82F6' }
    },
    {
      id: 'light',
      name: 'Claro',
      subtitle: 'Kimono White • Modo Claro',
      icon: Sun,
      accentColor: '#1E3A8A',
      bgColor: '#F8FAFC',
      preview: { primary: '#F8FAFC', secondary: '#FFFFFF', accent: '#1E3A8A' }
    },
    {
      id: 'colorful',
      name: 'Padrão',
      subtitle: 'Paleta Suave • Tons Pastéis',
      icon: Sparkles,
      accentColor: '#6366F1',
      bgColor: '#F4F6FB',
      preview: { primary: '#F4F6FB', secondary: '#E9EEF7', accent: '#818CF8' }
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center p-1 rounded-xl bg-theme-card/90 backdrop-blur-md border border-theme text-xs shadow-xs ${className}`}>
        {themes.map(t => {
          const Icon = t.icon;
          const isActive = theme === t.id || (t.id === 'colorful' && theme === 'padrao');
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                isActive
                  ? t.id === 'colorful'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : t.id === 'light'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                  : 'text-theme-muted hover:text-theme-main hover:bg-theme-subtle'
              }`}
              title={`${t.name} • ${t.subtitle}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Expanded card view for settings
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {themes.map(t => {
        const Icon = t.icon;
        const isActive = theme === t.id || (t.id === 'colorful' && theme === 'padrao');
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 group relative cursor-pointer ${
              isActive
                ? t.id === 'colorful'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-md'
                  : t.id === 'light'
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-md'
                  : 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-900/90 shadow-md'
                : 'border-theme hover:border-theme-active bg-theme-card/60'
            }`}
          >
            {/* Color Palette Preview Swatch */}
            <div className="flex items-center gap-1.5">
              <span 
                className="w-5 h-5 rounded-md border border-slate-300/40 shadow-xs" 
                style={{ backgroundColor: t.preview.primary }}
              />
              <span 
                className="w-5 h-5 rounded-md border border-slate-300/40 shadow-xs" 
                style={{ backgroundColor: t.preview.secondary }}
              />
              <span 
                className="w-5 h-5 rounded-md border border-slate-300/40 shadow-xs" 
                style={{ backgroundColor: t.preview.accent }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-theme-main flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-theme-accent transition-colors" />
                  {t.name}
                </span>
                {isActive && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-muted mt-0.5 leading-snug">
                {t.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
