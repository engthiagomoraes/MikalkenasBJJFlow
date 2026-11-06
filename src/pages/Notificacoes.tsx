import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Award, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Plus, 
  Sparkles, 
  ExternalLink,
  Flame,
  Filter
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { NotificationItem } from '../types';

export const Notificacoes: React.FC = () => {
  const { notifications, students, classes, sendNotification, resendNotification, academySettings } = useBjj();

  const [filterType, setFilterType] = useState<string>('all');
  const [showComposeModal, setShowComposeModal] = useState<boolean>(false);

  // Compose form state
  const [notifTipo, setNotifTipo] = useState<'treino' | 'vencimento' | 'graduacao' | 'geral'>('treino');
  const [notifTitulo, setNotifTitulo] = useState<string>('Lembrete de Treino: Tatame Aberto Hoje!');
  const [notifMensagem, setNotifMensagem] = useState<string>('Fala galera do Jiu-Jitsu! Hoje nosso treino começa pontualmente no horário habitual. Não esqueçam de trazer água e o kimono limpo. Oss!');
  const [notifDestinatario, setNotifDestinatario] = useState<string>('Todos os Alunos');
  const [notifCanal, setNotifCanal] = useState<'whatsapp' | 'email' | 'app'>('whatsapp');
  const [notifTelefone, setNotifTelefone] = useState<string>('');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.tipo === filterType;
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitulo || !notifMensagem) return;

    sendNotification({
      tipo: notifTipo,
      titulo: notifTitulo,
      mensagem: notifMensagem,
      destinatario: notifDestinatario,
      telefoneDestinatario: notifTelefone || undefined,
      canal: notifCanal
    });

    setShowComposeModal(false);
  };

  const applyTemplate = (tipo: 'treino' | 'vencimento' | 'graduacao' | 'seminario') => {
    if (tipo === 'treino') {
      setNotifTipo('treino');
      setNotifTitulo('🥋 Lembrete de Treino No-Gi Especial Hoje');
      setNotifMensagem('Atenção equipe! Hoje teremos aula especial de ataques de perna e defesa de quedas no No-Gi às 21h00. Venham com rashguard e bermuda adequada. Até o tatame! Oss!');
      setNotifDestinatario('Turma No-Gi & Competição');
    } else if (tipo === 'vencimento') {
      setNotifTipo('vencimento');
      setNotifTitulo(`💰 Lembrete Amigável: Mensalidade ${academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}`);
      setNotifMensagem(`Olá! Lembrando que a mensalidade do Jiu-Jitsu está próxima do vencimento. Chave PIX da academia: ${academySettings.chavePix || 'professormikalkenasbjj@gmail.com'}. Agradecemos por fazer parte da nossa família nos tatames!`);
      setNotifDestinatario('Mariana Duarte Costa');
      setNotifTelefone('(11) 98555-6677');
    } else if (tipo === 'graduacao') {
      setNotifTipo('graduacao');
      setNotifTitulo('🏆 Convocação: Cerimônia de Graduação e Faixas');
      setNotifMensagem('Temos a honra de convidar todos os alunos e familiares para a nossa Cerimônia Semestral de Graduação e entrega de graus e novas faixas neste sábado às 10h. Tragam kimono branco e disposição!');
      setNotifDestinatario('Todos os Alunos e Familiares');
    } else if (tipo === 'seminario') {
      setNotifTipo('geral');
      setNotifTitulo('🥋 Seminário Especial com Mestre Convidado');
      setNotifMensagem('No próximo sábado receberemos um Mestre Faixa Preta 5º Grau para um seminário imperdível sobre Passagem de Guarda de Lapela. Vagas limitadas, garanta a sua na recepção!');
      setNotifDestinatario('Todos os Alunos');
    }
  };

  const handleOpenWhatsAppDirect = (notif: NotificationItem) => {
    const phone = notif.telefoneDestinatario?.replace(/\D/g, '') || '';
    const message = encodeURIComponent(`*${notif.titulo}*\n\n${notif.mensagem}`);
    const url = phone ? `https://wa.me/55${phone}?text=${message}` : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            Comunicação & Mensageria
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notificações & Lembretes
          </h1>
          <p className="text-sm text-slate-500">
            Dispare lembretes de treinos, avisos de vencimento de mensalidade e convocações para graduação via WhatsApp e Tatame.
          </p>
        </div>

        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Notificação / Lembrete
        </button>
      </div>

      {/* Quick Trigger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { applyTemplate('treino'); setShowComposeModal(true); }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-blue-600 group-hover:underline">Usar Modelo →</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mt-3">Lembrete de Treino</h4>
          <p className="text-xs text-slate-500 mt-1">Avisar turmas sobre treinos específicos, No-Gi ou Open Mat.</p>
        </div>

        <div 
          onClick={() => { applyTemplate('vencimento'); setShowComposeModal(true); }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-amber-600 group-hover:underline">Usar Modelo →</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mt-3">Cobrança de Mensalidade</h4>
          <p className="text-xs text-slate-500 mt-1">Envio amigável de chave PIX e data de vencimento.</p>
        </div>

        <div 
          onClick={() => { applyTemplate('graduacao'); setShowComposeModal(true); }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-emerald-600 group-hover:underline">Usar Modelo →</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mt-3">Aviso de Graduação</h4>
          <p className="text-xs text-slate-500 mt-1">Convocação dos alunos aptos para receber grau ou faixa.</p>
        </div>

        <div 
          onClick={() => { applyTemplate('seminario'); setShowComposeModal(true); }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-purple-600 group-hover:underline">Usar Modelo →</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 mt-3">Seminários & Eventos</h4>
          <p className="text-xs text-slate-500 mt-1">Comunicados gerais, workshops e campeonatos.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('treino')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === 'treino' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Treinos
          </button>
          <button
            onClick={() => setFilterType('vencimento')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === 'vencimento' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mensalidades / Vencimentos
          </button>
          <button
            onClick={() => setFilterType('graduacao')}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === 'graduacao' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Graduações
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map(item => {
          const isTreino = item.tipo === 'treino';
          const isVencimento = item.tipo === 'vencimento';
          const isGraduacao = item.tipo === 'graduacao';

          return (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isTreino ? 'bg-blue-50 text-blue-600' :
                  isVencimento ? 'bg-amber-50 text-amber-600' :
                  isGraduacao ? 'bg-emerald-50 text-emerald-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {isTreino && <Flame className="w-5 h-5" />}
                  {isVencimento && <DollarSign className="w-5 h-5" />}
                  {isGraduacao && <Award className="w-5 h-5" />}
                  {!isTreino && !isVencimento && !isGraduacao && <Bell className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{item.titulo}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Canal: {item.canal.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ {item.statusEnvio}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed whitespace-pre-line">
                    {item.mensagem}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Destinatário: <strong className="text-slate-600">{item.destinatario}</strong></span>
                    <span>•</span>
                    <span>Disparo: {item.dataHora}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleOpenWhatsAppDirect(item)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Abrir no WhatsApp
                </button>

                <button
                  onClick={() => resendNotification(item.id)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                  title="Reenviar agora"
                >
                  Reenviar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compose Notification Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Nova Mensagem / Notificação</h3>
                <p className="text-xs text-slate-500">Envie avisos diretamente aos alunos ou turmas</p>
              </div>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Notificação</label>
                  <select
                    value={notifTipo}
                    onChange={(e) => setNotifTipo(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="treino">Lembrete de Treino</option>
                    <option value="vencimento">Cobrança de Mensalidade</option>
                    <option value="graduacao">Aviso de Graduação</option>
                    <option value="geral">Geral / Seminário</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Canal de Envio</label>
                  <select
                    value={notifCanal}
                    onChange={(e) => setNotifCanal(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="whatsapp">WhatsApp Direto</option>
                    <option value="app">Notificação Tatame (App)</option>
                    <option value="email">E-mail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  value={notifTitulo}
                  onChange={(e) => setNotifTitulo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Destinatário</label>
                <input
                  type="text"
                  value={notifDestinatario}
                  onChange={(e) => setNotifDestinatario(e.target.value)}
                  placeholder="Ex: Turma Noturna, Gabriel Pires ou Todos"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Telefone WhatsApp (Opcional para envio 1 a 1)</label>
                <input
                  type="text"
                  value={notifTelefone}
                  onChange={(e) => setNotifTelefone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Corpo da Mensagem</label>
                <textarea
                  rows={4}
                  value={notifMensagem}
                  onChange={(e) => setNotifMensagem(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Disparar Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
