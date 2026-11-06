import React from 'react';
import { CalendarDays, TrendingUp, DollarSign, Award, Users, Printer } from 'lucide-react';
import { useBjj } from '../context/BjjContext';

export const RelatorioAnual: React.FC = () => {
  const { students, payments, graduations, currentUser } = useBjj();

  const isProfessor = currentUser.role === 'professor';
  const scopedPayments = isProfessor 
    ? payments.filter(p => p.professorId === currentUser.professorId || (p.professorNome && p.professorNome.toLowerCase() === currentUser.nome.toLowerCase()))
    : payments;

  const totalAnualArrecadado = scopedPayments.reduce((acc, p) => p.status === 'em_dia' ? acc + p.valor : acc, 0) * 12;
  const totalBolsasAnual = scopedPayments.reduce((acc, p) => acc + (p.desconto || 0), 0) * 12;

  const meses = [
    { mes: 'Janeiro', presencas: 184, arrecadado: 2890, graduacoes: 2 },
    { mes: 'Fevereiro', presencas: 210, arrecadado: 3100, graduacoes: 1 },
    { mes: 'Março', presencas: 245, arrecadado: 3450, graduacoes: 3 },
    { mes: 'Abril', presencas: 260, arrecadado: 3600, graduacoes: 4 },
    { mes: 'Maio', presencas: 280, arrecadado: 3800, graduacoes: 2 },
    { mes: 'Junho', presencas: 310, arrecadado: 4100, graduacoes: 5 },
    { mes: 'Julho', presencas: 290, arrecadado: 3950, graduacoes: 2 },
    { mes: 'Agosto', presencas: 320, arrecadado: 4250, graduacoes: 4 },
    { mes: 'Setembro', presencas: 340, arrecadado: 4400, graduacoes: 3 },
    { mes: 'Outubro (Atual)', presencas: 312, arrecadado: 4350, graduacoes: 2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            Exercício Anual • 2026
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Relatório Anual do Dojo
          </h1>
          <p className="text-sm text-slate-500">
            Crescimento semestral, evolução de faixas, expansão do projeto comunitário e balanço consolidado.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors no-print"
        >
          Imprimir Balanço Anual
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projeção Anual Recebida</span>
          <div className="text-3xl font-black text-slate-900 mt-2">
            R$ {totalAnualArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">Faturamento anualizado sustentável</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Investimento em Bolsas / Social</span>
          <div className="text-3xl font-black text-purple-700 mt-2">
            R$ {totalBolsasAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-500 mt-1">Subsídio para atletas e famílias carentes</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Novas Faixas Outorgadas</span>
          <div className="text-3xl font-black text-amber-600 mt-2">
            28 Graduações
          </div>
          <p className="text-xs text-slate-500 mt-1">Certificadas no ano corrente</p>
        </div>
      </div>

      {/* Monthly Evolution Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">Evolução Mês a Mês</h3>
          <p className="text-xs text-slate-500">Histórico de frequência e arrecadação</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Mês de Referência</th>
                <th className="p-4">Presenças no Tatame</th>
                <th className="p-4">Graduações no Mês</th>
                <th className="p-4 text-right">Arrecadação Mensal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {meses.map(m => (
                <tr key={m.mes} className="hover:bg-slate-50">
                  <td className="p-4 font-sans font-semibold text-slate-900">{m.mes}</td>
                  <td className="p-4 text-slate-700">{m.presencas} check-ins</td>
                  <td className="p-4 text-amber-600 font-bold">{m.graduacoes} diplomas</td>
                  <td className="p-4 text-right font-bold text-emerald-700">
                    R$ {m.arrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
