import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  Share2, 
  MessageCircle, 
  Mail, 
  Award, 
  Calendar, 
  Clock, 
  Activity, 
  DollarSign, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Student, LearnedTechnique } from '../../types';
import { BeltBadge } from '../ui/BeltBadge';
import { useBjj } from '../../context/BjjContext';

interface StudentPdfReportModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentPdfReportModal: React.FC<StudentPdfReportModalProps> = ({ student, onClose }) => {
  const { academySettings } = useBjj();
  const [professorNotes, setProfessorNotes] = useState(
    'O atleta demonstra excelente disciplina, pontualidade nos treinos e assimilação consistente das técnicas curriculares ensinadas. Recomendado manter foco na repetição de drills de passagem de guarda e transições para finalização.'
  );
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const isApenasFaixas = student.sistemaGraduacao === 'apenas_faixas';
  const progressPct = Math.min(100, Math.round((student.presencasNaFaixa / student.presencasMetaGrau) * 100));

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const phoneClean = student.telefone.replace(/\D/g, '');
    const techniquesCount = student.tecnicasAprendidas?.length || 0;
    const msg = encodeURIComponent(
      `🥋 *RELATÓRIO PEDAGÓGICO DE JIU-JITSU • ${academySettings.nomeAcademia.toUpperCase()}*\n\n` +
      `Olá, *${student.nome}*!\n\n` +
      `Aqui está o resumo do seu desenvolvimento técnico no tatame:\n` +
      `• *Graduação Atual:* Faixa ${student.faixa.toUpperCase()}${!isApenasFaixas && student.graus > 0 ? ` (${student.graus}º grau)` : ''}\n` +
      `• *Metodologia:* ${isApenasFaixas ? 'Somente Troca de Faixas' : 'Graus e Faixas'}\n` +
      `• *Presenças na Faixa:* ${student.presencasNaFaixa} de ${student.presencasMetaGrau} aulas (${progressPct}% da meta)\n` +
      `• *Total Histórico de Treinos:* ${student.totalPresencasHistorico} aulas\n` +
      `• *Técnicas Aprendidas:* ${techniquesCount} posições registradas\n` +
      `• *Tempo de Sparring (Rola):* ${student.performance.tempoRolaMinutos} minutos\n` +
      `• *Status de Mensalidade:* ${student.statusPagamento === 'em_dia' ? 'Em Dia ✓' : 'Aberto'}\n\n` +
      `📝 *Parecer do Mestre (${student.professorNome || academySettings.mestreResponsavel}):*\n` +
      `"${professorNotes}"\n\n` +
      `Oss! Continue com foco nos treinos!`
    );

    const waUrl = phoneClean 
      ? `https://api.whatsapp.com/send?phone=55${phoneClean}&text=${msg}`
      : `https://api.whatsapp.com/send?text=${msg}`;
    window.open(waUrl, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Relatório Pedagógico de Jiu-Jitsu • ${student.nome} • ${academySettings.nomeAcademia}`);
    const body = encodeURIComponent(
      `Prezado(a) ${student.nome},\n\n` +
      `Segue o relatório oficial do seu desenvolvimento na ${academySettings.nomeAcademia}.\n\n` +
      `Graduação: Faixa ${student.faixa.toUpperCase()}${!isApenasFaixas ? ` (${student.graus}º grau)` : ''}\n` +
      `Presenças: ${student.presencasNaFaixa} de ${student.presencasMetaGrau} aulas (${progressPct}%)\n` +
      `Total de Treinos: ${student.totalPresencasHistorico} aulas\n\n` +
      `Parecer do Professor: ${professorNotes}\n\n` +
      `Oss,\n${student.professorNome || academySettings.mestreResponsavel}\n${academySettings.nomeAcademia}`
    );
    window.location.href = `mailto:${student.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Actions bar (hidden during print) */}
        <div className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Relatório do Aluno em PDF</span>
              <span className="text-[11px] text-slate-400">{student.nome} • {academySettings.nomeAcademia}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
              title="Enviar resumo do relatório por WhatsApp para o aluno"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar WhatsApp
            </button>

            <button
              onClick={handleSendEmail}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors border border-slate-700"
              title="Enviar relatório por e-mail"
            >
              <Mail className="w-4 h-4" />
              E-mail
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
              title="Imprimir ou Salvar como PDF via navegador"
            >
              <Printer className="w-4 h-4" />
              Salvar em PDF / Imprimir
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 md:p-10 space-y-6 text-slate-800 print-area bg-white">
          {/* Header do Documento */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Boletim Pedagógico & Evolução Técnica
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
                {academySettings.nomeAcademia}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Mestre Responsável: <strong>{academySettings.mestreResponsavel}</strong> ({academySettings.registroCBJJMestre}) • {academySettings.unidadePrincipal}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-slate-500 block">Emitido em: {todayStr}</span>
              <span className="text-[11px] text-slate-400 block font-mono">Matrícula #{student.id.slice(-6)}</span>
            </div>
          </div>

          {/* Card de Identificação do Atleta */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shrink-0 border-2 border-blue-600">
                {student.nome.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">{student.nome}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                  <BeltBadge 
                    faixa={student.faixa} 
                    graus={student.graus} 
                    sistemaGraduacao={student.sistemaGraduacao}
                    size="sm" 
                  />
                  <span>•</span>
                  <span>Prof.: <strong>{student.professorNome || academySettings.mestreResponsavel}</strong></span>
                  <span>•</span>
                  <span>Turma: {student.turmaPreferida}</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs space-y-1 border-t md:border-t-0 pt-2 md:pt-0">
              <span className="text-slate-500 block">Metodologia de Graduação:</span>
              <span className="font-extrabold text-slate-900 block text-sm">
                {isApenasFaixas ? 'Somente Troca de Faixas' : 'Sistema Tradicional (Graus + Faixa)'}
              </span>
              <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                student.statusPagamento === 'em_dia' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                Mensalidade: {student.statusPagamento.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Grid de 2 Colunas: Carga Horária & Radar Técnico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bloco 1: Presença e Assiduidade */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Carga Horária & Assiduidade de Tatame
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Histórico</span>
                  <span className="text-xl font-black text-slate-900">{student.totalPresencasHistorico}</span>
                  <span className="text-[11px] text-slate-500">aulas registradas</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tempo em Sparring</span>
                  <span className="text-xl font-black text-blue-700">{student.performance.tempoRolaMinutos}</span>
                  <span className="text-[11px] text-slate-500">minutos de rola</span>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Progresso para próxima graduação:</span>
                  <span className="font-bold text-blue-600">{student.presencasNaFaixa} de {student.presencasMetaGrau} aulas ({progressPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">
                  {isApenasFaixas 
                    ? 'Cumprindo a meta de aulas para troca direta de faixa.' 
                    : 'Cumprindo a meta de presenças para o próximo grau na graduação atual.'}
                </p>
              </div>
            </div>

            {/* Bloco 2: Radar dos 6 Fundamentos */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Avaliação Técnica dos 6 Fundamentos
                </h3>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Média {((student.performance.guarda + student.performance.passagem + student.performance.quedas + student.performance.finalizacoes + student.performance.defesa + student.performance.disciplina) / 6).toFixed(1)}/10
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Guarda</span>
                    <span className="font-mono">{student.performance.guarda}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${student.performance.guarda * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Passagem</span>
                    <span className="font-mono">{student.performance.passagem}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${student.performance.passagem * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Quedas / Em Pé</span>
                    <span className="font-mono">{student.performance.quedas}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${student.performance.quedas * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Finalizações</span>
                    <span className="font-mono">{student.performance.finalizacoes}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${student.performance.finalizacoes * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Defesa Pessoal</span>
                    <span className="font-mono">{student.performance.defesa}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-600 h-full rounded-full" style={{ width: `${student.performance.defesa * 10}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-0.5">
                    <span>Disciplina</span>
                    <span className="font-mono">{student.performance.disciplina}/10</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${student.performance.disciplina * 10}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Técnicas Aprendidas */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Histórico de Técnicas Aprendidas (Curricular)
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {student.tecnicasAprendidas?.length || 0} técnicas registradas
              </span>
            </div>

            {student.tecnicasAprendidas && student.tecnicasAprendidas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {student.tecnicasAprendidas.slice(0, 9).map(t => (
                  <div key={t.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                        {t.categoria}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {new Date(t.dataAprendida + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 truncate">{t.titulo}</p>
                    {t.aulaTitulo && <p className="text-[10px] text-slate-500 truncate">Aula: {t.aulaTitulo}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Nenhuma técnica curricular registrada até o momento.</p>
            )}
          </div>

          {/* Parecer do Professor */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-2 bg-amber-50/30">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Parecer Pedagógico do Mestre / Professor
              </h3>
              <button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-[11px] font-bold text-blue-600 hover:underline no-print"
              >
                {isEditingNotes ? 'Concluir Edição' : 'Editar Parecer'}
              </button>
            </div>

            {isEditingNotes ? (
              <textarea
                rows={3}
                value={professorNotes}
                onChange={(e) => setProfessorNotes(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white font-medium"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{professorNotes}"
              </p>
            )}
          </div>

          {/* Assinaturas */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-1">
              <div className="border-b border-slate-400 w-3/4 mx-auto pb-4" />
              <p className="font-extrabold text-slate-900">{student.professorNome || academySettings.mestreResponsavel}</p>
              <p className="text-[11px] text-slate-500">Professor / Responsável Técnico</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-slate-400 w-3/4 mx-auto pb-4" />
              <p className="font-extrabold text-slate-900">{student.nome}</p>
              <p className="text-[11px] text-slate-500">Atleta / Aluno</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
