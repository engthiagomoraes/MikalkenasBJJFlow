import React, { useState } from 'react';
import { 
  DevelopmentScores, 
  StudentEvaluation, 
  EVALUATION_DIMENSIONS,
  EvaluationDimension
} from '../../types';
import { TrendingUp, TrendingDown, Minus, Info, Calendar, UserCheck } from 'lucide-react';

interface DevelopmentRadarChartProps {
  primaryEvaluation: StudentEvaluation;
  comparisonEvaluation?: StudentEvaluation | null;
  size?: number;
  showLegend?: boolean;
  showScoringGuide?: boolean;
  compact?: boolean;
}

export const DevelopmentRadarChart: React.FC<DevelopmentRadarChartProps> = ({
  primaryEvaluation,
  comparisonEvaluation = null,
  size = 380,
  showLegend = true,
  showScoringGuide = false,
  compact = false
}) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);

  // Dimensões do SVG
  const cx = 200;
  const cy = 200;
  const radius = 125;
  const levels = [2, 4, 6, 8, 10]; // Escala fixa de 0 a 10

  const getCoordinates = (index: number, value: number, maxVal = 10) => {
    // 6 eixos: ângulo base = -PI/2 (eixo superior às 12h)
    const angle = (index * (2 * Math.PI) / 6) - (Math.PI / 2);
    const r = (Math.max(0, Math.min(10, value)) / maxVal) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Coordenadas para os anéis poligonais concêntricos de fundo (grid)
  const gridPolygons = levels.map(level => {
    const points = EVALUATION_DIMENSIONS.map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
    return { level, points };
  });

  // Polígono da avaliação principal
  const primaryPoints = EVALUATION_DIMENSIONS.map((dim, i) => {
    const val = primaryEvaluation.scores[dim.key] ?? 0;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  // Polígono da avaliação comparativa (se existir)
  const comparisonPoints = comparisonEvaluation ? EVALUATION_DIMENSIONS.map((dim, i) => {
    const val = comparisonEvaluation.scores[dim.key] ?? 0;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ') : null;

  // Cálculo da média aritmética simples
  const calcAverage = (scores: DevelopmentScores) => {
    const sum = EVALUATION_DIMENSIONS.reduce((acc, dim) => acc + (scores[dim.key] || 0), 0);
    return (sum / EVALUATION_DIMENSIONS.length).toFixed(1);
  };

  const primaryAvg = calcAverage(primaryEvaluation.scores);
  const compAvg = comparisonEvaluation ? calcAverage(comparisonEvaluation.scores) : null;
  const avgDelta = compAvg !== null ? (Number(primaryAvg) - Number(compAvg)).toFixed(1) : null;

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* Gráfico SVG Responsivo */}
      <div className="relative w-full flex justify-center items-center overflow-visible" style={{ maxWidth: size }}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-auto drop-shadow-xs"
          style={{ maxHeight: size }}
        >
          {/* Defs para Gradientes e Filtros */}
          <defs>
            <radialGradient id="radarGridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.3" />
            </radialGradient>
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Fundo concêntrico sutil */}
          <circle cx={cx} cy={cy} r={radius} fill="url(#radarGridGlow)" />

          {/* Polígonos de Grid Concêntricos (Escala 0 a 10) */}
          {gridPolygons.map(({ level, points }) => (
            <g key={`level-${level}`}>
              <polygon
                points={points}
                fill="none"
                stroke={level === 10 ? '#cbd5e1' : '#e2e8f0'}
                strokeWidth={level === 10 ? '1.5' : '1'}
                strokeDasharray={level === 10 ? 'none' : '3,3'}
              />
              {/* Rótulo de escala numérica no eixo vertical superior */}
              <text
                x={cx}
                y={cy - (level / 10) * radius - 3}
                textAnchor="middle"
                fontSize="8.5"
                fill="#94a3b8"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {level}
              </text>
            </g>
          ))}

          {/* Eixos Radiais (Spokes) dos 6 fundamentos */}
          {EVALUATION_DIMENSIONS.map((dim, i) => {
            const outer = getCoordinates(i, 10);
            const isHovered = hoveredDimension === dim.key;
            return (
              <line
                key={`spoke-${dim.key}`}
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke={isHovered ? '#3b82f6' : '#cbd5e1'}
                strokeWidth={isHovered ? '2' : '1.2'}
                strokeLinecap="round"
                className="transition-colors duration-200"
              />
            );
          })}

          {/* 1. Polígono de Comparação (se selecionado, renderizado atrás) */}
          {comparisonEvaluation && comparisonPoints && (
            <g className="transition-all duration-300">
              <polygon
                points={comparisonPoints}
                fill="#10b981"
                fillOpacity="0.22"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#shadowGlow)"
              />
              {EVALUATION_DIMENSIONS.map((dim, i) => {
                const val = comparisonEvaluation.scores[dim.key] ?? 0;
                const pt = getCoordinates(i, val);
                return (
                  <circle
                    key={`comp-dot-${dim.key}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                );
              })}
            </g>
          )}

          {/* 2. Polígono da Avaliação Principal */}
          <g className="transition-all duration-300">
            <polygon
              points={primaryPoints}
              fill="#3b82f6"
              fillOpacity={comparisonEvaluation ? "0.32" : "0.38"}
              stroke="#2563eb"
              strokeWidth="2.75"
              strokeLinejoin="round"
              filter="url(#shadowGlow)"
            />
            {EVALUATION_DIMENSIONS.map((dim, i) => {
              const val = primaryEvaluation.scores[dim.key] ?? 0;
              const pt = getCoordinates(i, val);
              const isHovered = hoveredDimension === dim.key;
              return (
                <circle
                  key={`prim-dot-${dim.key}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6.5" : "4.5"}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredDimension(dim.key)}
                  onMouseLeave={() => setHoveredDimension(null)}
                />
              );
            })}
          </g>

          {/* Centro do Radar */}
          <circle cx={cx} cy={cy} r="3" fill="#64748b" />

          {/* Rótulos dos 6 Vértices / Eixos */}
          {EVALUATION_DIMENSIONS.map((dim, i) => {
            // Posicionar o rótulo um pouco além do raio 10
            const angle = (i * (2 * Math.PI) / 6) - (Math.PI / 2);
            const labelR = radius + (compact ? 32 : 46);
            const lx = cx + labelR * Math.cos(angle);
            const ly = cy + labelR * Math.sin(angle);

            const primScore = primaryEvaluation.scores[dim.key] ?? 0;
            const compScore = comparisonEvaluation ? (comparisonEvaluation.scores[dim.key] ?? 0) : null;
            const delta = compScore !== null ? Number((primScore - compScore).toFixed(1)) : null;

            const isHovered = hoveredDimension === dim.key;

            return (
              <g 
                key={`label-${dim.key}`}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredDimension(dim.key)}
                onMouseLeave={() => setHoveredDimension(null)}
              >
                {/* Nome do Fundamento */}
                <text
                  x={lx}
                  y={ly - 7}
                  textAnchor="middle"
                  fontSize={compact ? "9" : "10.5"}
                  fontWeight={isHovered ? "800" : "700"}
                  fill={isHovered ? "#1e293b" : "#334155"}
                  fontFamily="sans-serif"
                >
                  {compact ? dim.shortLabel : dim.shortLabel}
                </text>

                {/* Badge de Nota Atual e Delta */}
                <text
                  x={lx}
                  y={ly + 8}
                  textAnchor="middle"
                  fontSize={compact ? "9" : "10"}
                  fontWeight="800"
                  fontFamily="monospace"
                  fill="#1d4ed8"
                >
                  {primScore.toFixed(1)}
                  {compScore !== null && (
                    <tspan
                      dx="5"
                      fontSize="9"
                      fontWeight="700"
                      fill={delta && delta > 0 ? "#059669" : delta && delta < 0 ? "#dc2626" : "#64748b"}
                    >
                      {delta && delta > 0 ? `(+${delta})` : delta && delta < 0 ? `(${delta})` : '(=)'}
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legenda Informativa com Datas e Avaliadores */}
      {showLegend && (
        <div className="w-full mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Avaliação Principal */}
          <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200/80 px-3 py-1.5 rounded-xl">
            <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0 shadow-2xs" />
            <div>
              <span className="font-extrabold text-blue-900 block leading-tight">
                {comparisonEvaluation ? 'Avaliação Recente / Selecionada' : 'Avaliação Atual'}
              </span>
              <span className="text-[11px] text-blue-700 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                {new Date(primaryEvaluation.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                {primaryEvaluation.avaliadorNome && (
                  <span className="text-blue-600 font-sans font-medium">
                    • Prof. {primaryEvaluation.avaliadorNome}
                  </span>
                )}
              </span>
            </div>
            <div className="ml-2 pl-2 border-l border-blue-200 text-right">
              <span className="text-[10px] text-blue-500 uppercase font-bold block">Média</span>
              <span className="font-black text-sm text-blue-700">{primaryAvg}</span>
            </div>
          </div>

          {/* Avaliação de Comparação (se houver) */}
          {comparisonEvaluation && (
            <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0 shadow-2xs" />
              <div>
                <span className="font-extrabold text-emerald-900 block leading-tight">
                  Avaliação de Comparação
                </span>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {new Date(comparisonEvaluation.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                  {comparisonEvaluation.avaliadorNome && (
                    <span className="text-emerald-600 font-sans font-medium">
                      • Prof. {comparisonEvaluation.avaliadorNome}
                    </span>
                  )}
                </span>
              </div>
              <div className="ml-2 pl-2 border-l border-emerald-200 text-right">
                <span className="text-[10px] text-emerald-500 uppercase font-bold block">Média</span>
                <span className="font-black text-sm text-emerald-700">{compAvg}</span>
              </div>
            </div>
          )}

          {/* Variação Geral */}
          {comparisonEvaluation && avgDelta !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Evolução Geral:</span>
              <span className={`text-xs font-black font-mono flex items-center gap-0.5 ${
                Number(avgDelta) > 0 ? 'text-emerald-600' :
                Number(avgDelta) < 0 ? 'text-rose-600' :
                'text-slate-600'
              }`}>
                {Number(avgDelta) > 0 ? <TrendingUp className="w-3.5 h-3.5" /> :
                 Number(avgDelta) < 0 ? <TrendingDown className="w-3.5 h-3.5" /> :
                 <Minus className="w-3.5 h-3.5" />}
                {Number(avgDelta) > 0 ? `+${avgDelta}` : avgDelta} pts
              </span>
            </div>
          )}
        </div>
      )}

      {/* Orientação Breve de Pontuação e Aviso de Média Aritmética */}
      {showScoringGuide && (
        <div className="w-full mt-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 text-xs text-slate-600 space-y-2.5">
          <div className="flex items-start gap-2 text-slate-700">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                Critério Pedagógico & Média Aritmética Simples
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                A média informada é calculada pela <strong>média aritmética simples</strong> das 6 dimensões (soma das notas ÷ 6).
                Ela serve exclusivamente como diagnóstico didático e direcionamento de treinos, <strong>NÃO constituindo regra direta de promoção ou troca de faixa</strong> (as graduações seguem os critérios oficiais da IBJJF/CBJJ por tempo de carência e frequência de aulas).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-lg bg-white border border-slate-200/60">
              <span className="font-bold text-slate-700 block">0,0 - 3,5</span>
              <span className="text-slate-500 text-[10px]">Introdução / Fundamentos em assimilação</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200/60">
              <span className="font-bold text-blue-700 block">4,0 - 6,5</span>
              <span className="text-slate-500 text-[10px]">Desenvolvimento consistente</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200/60">
              <span className="font-bold text-indigo-700 block">7,0 - 8,5</span>
              <span className="text-slate-500 text-[10px]">Domínio técnico autônomo</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200/60">
              <span className="font-bold text-emerald-700 block">9,0 - 10,0</span>
              <span className="text-slate-500 text-[10px]">Excelência & Referência técnica</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
