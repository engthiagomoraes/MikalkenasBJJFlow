import React from 'react';

export type MikalkenasLogoVariant = 'triangle' | 'belt' | 'symbol' | 'full' | 'circle' | 'metallic' | 'flat' | 'contour' | 'shield';

interface MikalkenasLogoProps {
  variant?: MikalkenasLogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  themeColor?: 'light' | 'dark' | 'auto';
}

/**
 * Mikalkenas Jiu Jitsu Official Visual Identity
 * Utiliza os emblemas oficiais:
 * - Triângulo com o Polvo/Lula estilizado e tipografia MIKALKENAS
 * - Tarja / Faixa estilizada "mikalkenas" com graus vermelhos
 * - Símbolo minimalista monocromático
 */
export const MikalkenasLogo: React.FC<MikalkenasLogoProps> = ({
  variant = 'triangle',
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  themeColor = 'auto'
}) => {
  const sizeMap = {
    sm: { symbol: 28, text: 'text-sm', sub: 'text-[8px]' },
    md: { symbol: 40, text: 'text-base', sub: 'text-[9px]' },
    lg: { symbol: 52, text: 'text-xl', sub: 'text-[10px]' },
    xl: { symbol: 68, text: 'text-2xl', sub: 'text-xs' },
    '2xl': { symbol: 96, text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Imagens oficiais fornecidas em /public/assets/aistudio/
  // WhatsApp_Image_2026-11-06_at_12.34.10_7b253e62.jpeg -> Triângulo escuro com símbolo branco MIKALKENAS
  // WhatsApp_Image_2026-11-06_at_12.34.11_5c15bb57.jpeg -> Triângulo claro com símbolo preto MIKALKENAS
  // WhatsApp_Image_2026-11-06_at_12.34.11__1__15678711.jpeg -> Faixa / Tarja mikalkenas com listras vermelhas
  // WhatsApp_Image_2026-11-06_at_12.34.14__2__9de74e04.jpeg -> Símbolo branco vazado fundo preto
  // WhatsApp_Image_2026-11-06_at_12.34.14_8328fa1b.jpeg -> Símbolo preto vazado fundo branco

  const darkTriangleImg = '/assets/aistudio/WhatsApp_Image_2026-11-06_at_12.34.10_7b253e62.jpeg';
  const lightTriangleImg = '/assets/aistudio/WhatsApp_Image_2026-11-06_at_12.34.11_5c15bb57.jpeg';
  const beltBarImg = '/assets/aistudio/WhatsApp_Image_2026-11-06_at_12.34.11__1__15678711.jpeg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Image Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: currentSize.symbol, height: currentSize.symbol }}
      >
        {variant === 'belt' ? (
          <img 
            src={beltBarImg} 
            alt="Mikalkenas Jiu Jitsu" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        ) : (
          <img 
            src={themeColor === 'light' ? lightTriangleImg : darkTriangleImg} 
            alt="Mikalkenas Jiu Jitsu" 
            className="w-full h-full object-contain rounded-lg drop-shadow-md"
          />
        )}
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span 
            className={`font-black tracking-wider uppercase font-mono text-white ${currentSize.text}`}
            style={{ letterSpacing: '0.12em' }}
          >
            MIKALKENAS
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[2px] w-2.5 bg-red-600"></span>
            <span 
              className="font-bold tracking-widest text-[10px] uppercase text-zinc-300"
              style={{ letterSpacing: '0.24em' }}
            >
              JIU JITSU
            </span>
            <span className="h-[2px] w-2.5 bg-red-600"></span>
          </div>
          {showTagline && (
            <span className={`font-semibold tracking-wider text-zinc-400 mt-1 uppercase ${currentSize.sub}`}>
              Sensei Edson Mikalkenas
            </span>
          )}
        </div>
      )}
    </div>
  );
};
