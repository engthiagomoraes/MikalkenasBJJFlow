import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  BookOpen, 
  Users, 
  Tag, 
  Flame, 
  ShieldCheck,
  Target,
  Award,
  Search,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { LessonPlan, Technique } from '../types';
import { ViewToggle, ViewMode } from '../components/ui/ViewToggle';

export const Planejamento: React.FC = () => {
  const { lessonPlans, classes, instructors, techniques, attendance, addLessonPlan, toggleLessonPlanDone, academySettings } = useBjj();

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New plan form state
  const [newTema, setNewTema] = useState('');
  const [newTurma, setNewTurma] = useState(classes[0]?.titulo || '');
  const [newProfessor, setNewProfessor] = useState(instructors[0]?.nome || '');
  const [newSemanaCiclo, setNewSemanaCiclo] = useState(1);
  const [newData, setNewData] = useState(new Date().toISOString().split('T')[0]);
  const [newAquecimento, setNewAquecimento] = useState('15 min: Fuga de quadril, rolamentos e entrada de queda.');
  const [newTecnicaPrincipal, setNewTecnicaPrincipal] = useState('25 min: Raspagem tesourinha com transição para montada.');
  const [newDrill, setNewDrill] = useState('15 min: 20 repetições de cada lado cronometradas.');
  const [newRola, setNewRola] = useState('25 min: Sparring específico saindo da guarda. 5 rounds de 5 min.');
  const [newObservacoes, setNewObservacoes] = useState('');
  const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<string[]>([]);
  const [techniqueSearch, setTechniqueSearch] = useState('');

  const filteredPlans = lessonPlans.filter(p => {
    if (filterWeek === 'all') return true;
    return p.semanaCiclo === Number(filterWeek);
  });

  const toggleTechniqueSelection = (tech: Technique) => {
    if (selectedTechniqueIds.includes(tech.id)) {
      setSelectedTechniqueIds(prev => prev.filter(id => id !== tech.id));
    } else {
      setSelectedTechniqueIds(prev => [...prev, tech.id]);
      if (!newTema) {
        setNewTema(tech.titulo);
      }
      if (!newTecnicaPrincipal || newTecnicaPrincipal.includes('Raspagem tesourinha')) {
        setNewTecnicaPrincipal(`25 min: ${tech.titulo} - ${tech.descricao}`);
      }
    }
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTema) return;

    const chosenTechs = techniques.filter(t => selectedTechniqueIds.includes(t.id));
    const chosenTitles = chosenTechs.map(t => t.titulo);

    addLessonPlan({
      data: newData,
      semanaCiclo: Number(newSemanaCiclo),
      temaPrincipal: newTema,
      turma: newTurma,
      professor: newProfessor,
      aquecimento: newAquecimento,
      tecnicaPrincipal: newTecnicaPrincipal || (chosenTitles.length > 0 ? chosenTitles.join(', ') : 'Técnica do dia'),
      techniqueIds: selectedTechniqueIds,
      tecnicasNomes: chosenTitles,
      drillRepeticoes: newDrill,
      treinoEspecificoRola: newRola,
      observacoes: newObservacoes,
      concluida: false
    });

    setShowAddModal(false);
    setNewTema('');
    setSelectedTechniqueIds([]);
  };

  const applyTemplate = (tipo: 'iniciante' | 'competicao' | 'infantil' | 'nogi') => {
    if (tipo === 'iniciante') {
      setNewTema('Fundamentos da Guarda Fechada: Quebras de Postura e Armlock');
      setNewAquecimento('15 min: Aquecimento articular, rolamento de frente e costas, fuga de quadril.');
      setNewTecnicaPrincipal('25 min: Armlock partindo da guarda fechada com transição para triângulo.');
      setNewDrill('15 min: 30 entradas dinâmicas de armlock com foco em fechar os joelhos e empurrar calcanhar.');
      setNewRola('20 min: Rola posicional - quem estiver na guarda tenta raspar ou finalizar; o de cima tenta passar.');
      setNewTurma('Jiu-Jitsu Matinal (Geral)');
      const armlock = techniques.find(t => t.titulo.toLowerCase().includes('armlock'));
      const triangulo = techniques.find(t => t.titulo.toLowerCase().includes('triângulo'));
      setSelectedTechniqueIds([armlock?.id, triangulo?.id].filter(Boolean) as string[]);
    } else if (tipo === 'competicao') {
      setNewTema('Passagem de Guarda de Pressão e Defesa de Single-Leg');
      setNewAquecimento('15 min: Sprawls explosivos, quedas com elástico e corrida intervalada no tatame.');
      setNewTecnicaPrincipal('25 min: Passagem Toreando com velocidade e pressão de quadril.');
      setNewDrill('15 min: Drill de alta intensidade com troca contínua de parceiro a cada 40 segundos.');
      setNewRola('35 min: 5 rounds de 6 minutos com regras IBJJF e placar ativo.');
      setNewTurma('Submission & No-Gi Avançado');
      const toreando = techniques.find(t => t.titulo.toLowerCase().includes('toreando'));
      const queda = techniques.find(t => t.categoria === 'Queda');
      setSelectedTechniqueIds([toreando?.id, queda?.id].filter(Boolean) as string[]);
    } else if (tipo === 'infantil') {
      setNewTema('Jiu-Jitsu Kids: Defesa Pessoal Contra Abraço de Urso e Jogo da Montada');
      setNewAquecimento('15 min: Brincadeira da ponte, postura do caranguejo e corrida dos samurais.');
      setNewTecnicaPrincipal('20 min: Defesa pessoal contra agarre pela frente com queda de quadril segura.');
      setNewDrill('15 min: Treino de base firme com parceiro tentando desequilibrar.');
      setNewRola('15 min: Desafio amigável "Quem mantém a montada por 30 segundos".');
      setNewTurma('Jiu-Jitsu Infantil (Kids 6-12 anos)');
      const defesa = techniques.find(t => t.categoria === 'Defesa Pessoal');
      setSelectedTechniqueIds([defesa?.id].filter(Boolean) as string[]);
    } else if (tipo === 'nogi') {
      setNewTema('No-Gi: Ataques de Calcanhar e Defesa de Chave de Perna (Heel Hook & Ashi Garami)');
      setNewAquecimento('15 min: Mobilidade de tornozelos, flexibilidade de quadris e pummelling em pé.');
      setNewTecnicaPrincipal('25 min: Entrada de Ashi Garami da Guarda Borboleta e acabamento no Inside Heel Hook.');
      setNewDrill('15 min: Transição segura de pegada de perna sem torção brusca.');
      setNewRola('25 min: Sparring No-Gi com ênfase em controle de alavanca de perna.');
      setNewTurma('Submission & No-Gi Avançado');
      const heel = techniques.find(t => t.titulo.toLowerCase().includes('heel hook') || t.titulo.toLowerCase().includes('calcanhar'));
      setSelectedTechniqueIds([heel?.id].filter(Boolean) as string[]);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Finalização': return 'bg-red-50 text-red-700 border-red-200';
      case 'Raspagem': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Passagem de Guarda': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Queda': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Defesa Pessoal': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            Metodologia & Pedagogia Curricular
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-theme-main tracking-tight">
            Planejamento de Aulas & Técnicas
          </h1>
          <p className="text-sm text-theme-muted">
            Indique as técnicas a serem ensinadas em cada aula. Os alunos com presença confirmada receberão o histórico automaticamente como <strong>técnica aprendida</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <ViewToggle 
            mode={viewMode} 
            onChange={setViewMode} 
            cardsLabel="Visualização em Cards"
            tableLabel="Visualização em Tabela"
          />

          <button
            onClick={() => {
              setSelectedTechniqueIds([]);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Plano de Aula
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4.5 flex items-start gap-3 shadow-xs">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-theme-muted leading-relaxed">
          <strong className="block text-sm font-extrabold text-theme-main mb-0.5">
            Sincronização Automática: Presença = Técnica Aprendida
          </strong>
          Ao vincular técnicas da biblioteca no planejamento do dia, todo aluno que fizer check-in ou tiver a presença marcada naquela aula terá o registro gravado em sua ficha de desenvolvimento. O aluno acompanha seu progresso curricular diretamente no seu portal.
        </div>
      </div>

      {/* Filter by Cycle Week */}
      <div className="flex items-center justify-between bg-theme-card rounded-2xl p-4 border border-theme shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-theme-muted" />
          <span className="text-xs font-bold text-theme-main">Ciclo Curricular Mensal:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['all', '1', '2', '3', '4'].map(w => (
            <button
              key={w}
              onClick={() => setFilterWeek(w)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                filterWeek === w 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-theme-subtle text-theme-muted hover:bg-theme-card-hover'
              }`}
            >
              {w === 'all' ? 'Todas as Semanas' : `Semana ${w}`}
            </button>
          ))}
        </div>
      </div>

      {/* Content: Cards or Table */}
      {filteredPlans.length === 0 ? (
        <div className="bg-theme-card rounded-2xl p-12 text-center border border-theme text-theme-muted space-y-3">
          <ClipboardList className="w-12 h-12 text-theme-dim mx-auto" />
          <h3 className="font-bold text-theme-main text-base">Nenhum plano de aula encontrado</h3>
          <p className="text-xs text-theme-muted max-w-sm mx-auto">
            Não há planejamentos cadastrados para o ciclo curricular selecionado.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.map(plan => {
          // Find techniques attached
          const attachedTechniques: Array<{ id: string; titulo: string; categoria: string }> = [];
          if (plan.techniqueIds && plan.techniqueIds.length > 0) {
            plan.techniqueIds.forEach(id => {
              const t = techniques.find(tech => tech.id === id);
              if (t) attachedTechniques.push({ id: t.id, titulo: t.titulo, categoria: t.categoria });
            });
          }
          if (attachedTechniques.length === 0 && plan.tecnicasNomes && plan.tecnicasNomes.length > 0) {
            plan.tecnicasNomes.forEach((name, i) => {
              const t = techniques.find(tech => tech.titulo.toLowerCase() === name.toLowerCase());
              attachedTechniques.push({ id: t?.id || `tech-${i}`, titulo: name, categoria: t?.categoria || 'Fundamento' });
            });
          }

          // Count attendances for this lesson plan
          const attendancesCount = attendance.filter(a => 
            a.data === plan.data && (
              a.turmaTitulo === plan.turma ||
              (plan.turma && a.turmaTitulo.toLowerCase().includes(plan.turma.toLowerCase())) ||
              (plan.turma && plan.turma.toLowerCase().includes(a.turmaTitulo.toLowerCase())) ||
              (plan.turmaId && a.turmaId === plan.turmaId)
            )
          ).length;

          return (
            <div 
              key={plan.id}
              className={`bg-theme-card rounded-2xl border shadow-xs transition-all flex flex-col justify-between overflow-hidden ${
                plan.concluida ? 'border-emerald-500/40' : 'border-theme hover:border-theme-active'
              }`}
            >
              <div className="p-6 space-y-4">
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono text-[11px]">
                      Semana {plan.semanaCiclo}
                    </span>
                    <span className="text-theme-muted font-mono">
                      📅 {new Date(plan.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleLessonPlanDone(plan.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      plan.concluida 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-theme-subtle text-theme-muted hover:bg-theme-card-hover'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {plan.concluida ? 'Aula Concluída' : 'Marcar Concluída'}
                  </button>
                </div>

                {/* Title & Target Class */}
                <div>
                  <h3 className="font-extrabold text-lg text-theme-main leading-snug">
                    {plan.temaPrincipal}
                  </h3>
                  <p className="text-xs text-theme-muted mt-1 flex items-center gap-2 flex-wrap">
                    <span>Turma: <strong className="text-theme-main">{plan.turma}</strong></span>
                    <span>•</span>
                    <span>Prof.: <strong className="text-theme-main">{plan.professor}</strong></span>
                  </p>
                </div>

                {/* Techniques Taught (Core feature) */}
                <div className="p-3.5 bg-blue-500/10 rounded-xl border border-blue-400/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-theme-main flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" />
                      Técnicas Ensinadas nesta Aula ({attachedTechniques.length || 1}):
                    </span>
                    <span className="text-[11px] font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-full">
                      Histórico Ativo
                    </span>
                  </div>

                  {attachedTechniques.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {attachedTechniques.map(t => (
                        <span 
                          key={t.id + t.titulo}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${getCategoryColor(t.categoria)}`}
                        >
                          <Award className="w-3 h-3" />
                          {t.titulo}
                          <span className="text-[10px] opacity-75">({t.categoria})</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-theme-main font-medium">
                      {plan.tecnicaPrincipal}
                    </div>
                  )}

                  <div className="text-[11px] text-theme-muted flex items-center justify-between pt-1 border-t border-blue-400/20">
                    <span className="flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {attendancesCount > 0 
                        ? `${attendancesCount} aluno(s) presentes com técnica aprendida registrada` 
                        : 'Aguardando presenças da turma para registrar histórico'}
                    </span>
                  </div>
                </div>

                {/* Breakdown sections */}
                <div className="space-y-2.5 text-xs text-theme-muted pt-1">
                  <div className="p-3 bg-theme-subtle rounded-xl border border-theme">
                    <span className="font-bold text-theme-main block mb-0.5 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Aquecimento & Mobilidade Específica:
                    </span>
                    <p className="text-theme-muted">{plan.aquecimento}</p>
                  </div>

                  <div className="p-3 bg-theme-subtle rounded-xl border border-theme">
                    <span className="font-bold text-theme-main block mb-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-theme-muted" />
                      Drills & Repetições:
                    </span>
                    <p className="text-theme-muted">{plan.drillRepeticoes}</p>
                  </div>

                  <div className="p-3 bg-theme-subtle rounded-xl border border-theme">
                    <span className="font-bold text-theme-main block mb-0.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Sparring / Rola Específico:
                    </span>
                    <p className="text-theme-muted">{plan.treinoEspecificoRola}</p>
                  </div>

                  {plan.observacoes && (
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-400/20 text-[11px] text-theme-muted">
                      <strong className="text-amber-300">Obs. do Professor:</strong> {plan.observacoes}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-theme-subtle px-6 py-3 border-t border-theme flex items-center justify-between text-xs text-theme-muted">
                <span>Grade Curricular {academySettings.nomeAcademia || 'Mikalkenas Jiu Jitsu'}</span>
                <span className="font-mono text-[11px]">80 min de aula total</span>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        /* Visualização em Lista / Tabela */
        <div className="bg-theme-card rounded-2xl border border-theme shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-theme-subtle text-theme-muted font-bold border-b border-theme uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Semana & Data</th>
                  <th className="p-4">Tema da Aula</th>
                  <th className="p-4">Turma & Professor</th>
                  <th className="p-4">Técnicas Curriculares</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {filteredPlans.map(plan => {
                  const attachedTechniques: Array<{ id: string; titulo: string }> = [];
                  if (plan.techniqueIds && plan.techniqueIds.length > 0) {
                    plan.techniqueIds.forEach(id => {
                      const t = techniques.find(tech => tech.id === id);
                      if (t) attachedTechniques.push({ id: t.id, titulo: t.titulo });
                    });
                  }
                  if (attachedTechniques.length === 0 && plan.tecnicasNomes && plan.tecnicasNomes.length > 0) {
                    plan.tecnicasNomes.forEach((name, i) => {
                      attachedTechniques.push({ id: `tech-${i}`, titulo: name });
                    });
                  }

                  return (
                    <tr key={plan.id} className="hover:bg-theme-card-hover transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-theme-main bg-theme-subtle px-2 py-0.5 rounded text-[11px]">
                            Semana {plan.semanaCiclo}
                          </span>
                          <span className="text-[11px] text-theme-muted block">
                            {new Date(plan.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-theme-main block text-sm">{plan.temaPrincipal}</span>
                        <p className="text-[11px] text-theme-muted truncate max-w-[240px] mt-0.5">{plan.tecnicaPrincipal}</p>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] block max-w-fit mb-0.5">
                          {plan.turma}
                        </span>
                        <span className="text-[11px] text-theme-muted">Prof. {plan.professorNome}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-[220px]">
                          {attachedTechniques.length > 0 ? (
                            attachedTechniques.map(t => (
                              <span key={t.id} className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                                {t.titulo}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Padrão da aula</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleLessonPlanDone(plan.id)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-full border inline-flex items-center gap-1 transition-colors ${
                            plan.concluida 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-theme-subtle text-theme-muted border-theme hover:bg-theme-card-hover'
                          }`}
                        >
                          <CheckCircle className={`w-3 h-3 ${plan.concluida ? 'text-emerald-600' : 'text-slate-400'}`} />
                          {plan.concluida ? 'Concluída' : 'Pendente'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleLessonPlanDone(plan.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-theme-main bg-theme-subtle hover:bg-theme-card-hover rounded-lg transition-colors"
                        >
                          Alternar Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal New Lesson Plan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Criar Novo Plano de Aula</h3>
                <p className="text-xs text-slate-500">
                  Estruture a aula e selecione as técnicas ensinadas para alimentar o histórico dos alunos presentes.
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            {/* Quick Template Picker */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">Usar Modelo Rápido:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('iniciante')}
                  className="text-xs bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  🥋 Fundamentos Guarda
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('competicao')}
                  className="text-xs bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  ⚡ Pressão de Passagem
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('infantil')}
                  className="text-xs bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  🦁 Jiu-Jitsu Kids
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('nogi')}
                  className="text-xs bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                  🔥 No-Gi & Leglocks
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Data da Aula</label>
                  <input
                    type="date"
                    value={newData}
                    onChange={(e) => setNewData(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Semana do Ciclo</label>
                  <select
                    value={newSemanaCiclo}
                    onChange={(e) => setNewSemanaCiclo(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold"
                  >
                    <option value={1}>Semana 1 - Fundamentos e Guarda Fechada</option>
                    <option value={2}>Semana 2 - Passagens e Mobilidade</option>
                    <option value={3}>Semana 3 - Finalizações e Quedas</option>
                    <option value={4}>Semana 4 - Sparring & Lapidação Técnica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tema Principal da Aula</label>
                <input
                  type="text"
                  placeholder="Ex: Armlock da Guarda Fechada com Quebra de Postura"
                  value={newTema}
                  onChange={(e) => setNewTema(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-800"
                  required
                />
              </div>

              {/* Technique Selector from Library (Key Requirement) */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-blue-950 flex items-center gap-1.5 text-xs">
                    <Target className="w-4 h-4 text-blue-600" />
                    Indicar Técnicas Ensinadas na Aula (Biblioteca):
                  </label>
                  <span className="text-[11px] font-bold text-blue-700">
                    {selectedTechniqueIds.length} selecionada(s)
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar técnicas da biblioteca..."
                    value={techniqueSearch}
                    onChange={(e) => setTechniqueSearch(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-1.5 pl-8 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 bg-white p-2 rounded-lg border border-blue-100">
                  {techniques
                    .filter(t => t.titulo.toLowerCase().includes(techniqueSearch.toLowerCase()) || t.categoria.toLowerCase().includes(techniqueSearch.toLowerCase()))
                    .map(tech => {
                      const isSelected = selectedTechniqueIds.includes(tech.id);
                      return (
                        <div
                          key={tech.id}
                          onClick={() => toggleTechniqueSelection(tech)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                              : 'hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                              isSelected ? 'bg-white text-blue-600 border-white' : 'border-slate-300'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="font-bold">{tech.titulo}</span>
                          </div>

                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tech.categoria}
                          </span>
                        </div>
                      );
                    })}
                </div>

                <p className="text-[11px] text-blue-900 flex items-center gap-1 font-medium">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Os alunos com presença registrada nesta data/turma terão estas técnicas gravadas como <strong>aprendidas</strong> no perfil.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Turma Destino</label>
                  <select
                    value={newTurma}
                    onChange={(e) => setNewTurma(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.titulo}>{c.titulo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Professor Responsável</label>
                  <select
                    value={newProfessor}
                    onChange={(e) => setNewProfessor(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.nome}>{i.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aquecimento & Mobilidade (15 min)</label>
                <textarea
                  rows={2}
                  value={newAquecimento}
                  onChange={(e) => setNewAquecimento(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detalhamento da Posição / Técnica Principal</label>
                <textarea
                  rows={2}
                  value={newTecnicaPrincipal}
                  onChange={(e) => setNewTecnicaPrincipal(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Drills & Repetições (15 min)</label>
                  <textarea
                    rows={2}
                    value={newDrill}
                    onChange={(e) => setNewDrill(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sparring / Rola Específico (25 min)</label>
                  <textarea
                    rows={2}
                    value={newRola}
                    onChange={(e) => setNewRola(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Observações do Mestre (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Focar no ajuste do quadril para os alunos faixa branca"
                  value={newObservacoes}
                  onChange={(e) => setNewObservacoes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Publicar Plano com Técnicas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
