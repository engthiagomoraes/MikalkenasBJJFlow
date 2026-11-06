import React from 'react';
import { Award, Printer, X } from 'lucide-react';
import { BeltBadge } from '../ui/BeltBadge';
import { BeltColor } from '../../types';
import { useBjj } from '../../context/BjjContext';

interface GraduationCertificateProps {
  studentNome: string;
  faixa: BeltColor;
  graus: number;
  data: string;
  professorNome: string;
  registroCBJJ?: string;
  onClose: () => void;
}

export const GraduationCertificate: React.FC<GraduationCertificateProps> = ({
  studentNome,
  faixa,
  graus,
  data,
  professorNome,
  registroCBJJ,
  onClose
}) => {
  const { academySettings } = useBjj();
  
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(data).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const effectiveAcademia = academySettings?.nomeAcademia || 'Mikalkenas Jiu Jitsu';
  const effectiveProfessor = professorNome || academySettings?.mestreResponsavel || 'Mestre Responsável';
  const effectiveRegistroCBJJ = registroCBJJ || academySettings?.registroCBJJMestre || 'CBJJ #48291';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Actions bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Certificado Oficial de Graduação BJJ</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir Certificado
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-8 md:p-12 bg-amber-50/40 relative text-slate-800 border-8 border-double border-amber-800/20 m-4 rounded-xl print-area">
          {/* Watermark background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-slate-900" />
          </div>

          <div className="relative text-center space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-amber-400 mb-2 shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xs uppercase tracking-widest text-amber-900/80 font-bold">
                Federação Brasileira de Jiu-Jitsu • {effectiveAcademia}
              </h4>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 font-serif">
                CERTIFICADO DE GRADUAÇÃO
              </h1>
            </div>

            <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Certificamos perante a comunidade das artes marciais que o(a) praticante
            </p>

            <div className="py-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-b-2 border-slate-400/40 inline-block px-8 pb-1 tracking-wide">
                {studentNome}
              </h2>
            </div>

            <p className="text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
              cumpriu com honra, disciplina, técnica e tempo de tatame todos os requisitos necessários e foi promovido(a) à graduação de:
            </p>

            <div className="flex justify-center items-center gap-3 py-2">
              <BeltBadge faixa={faixa} graus={graus} size="lg" />
            </div>

            <p className="text-xs md:text-sm text-slate-500 italic max-w-lg mx-auto">
              "A disciplina é a mãe do sucesso. O Jiu-Jitsu não é sobre vencer os outros, mas superar a si mesmo a cada treino."
            </p>

            {/* Date and Signatures */}
            <div className="pt-8 grid grid-cols-2 gap-8 items-end max-w-lg mx-auto">
              <div className="text-center space-y-1">
                <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                <p className="font-bold text-sm text-slate-900">{effectiveProfessor}</p>
                <p className="text-xs text-slate-500">Mestre Avaliador ({effectiveRegistroCBJJ})</p>
              </div>

              <div className="text-center space-y-1">
                <div className="h-0.5 bg-slate-400 w-full mb-1"></div>
                <p className="font-bold text-sm text-slate-900">{formattedDate}</p>
                <p className="text-xs text-slate-500">Data de Outorga Oficial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
