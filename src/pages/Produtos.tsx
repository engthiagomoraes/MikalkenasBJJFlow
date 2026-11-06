import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  Search, 
  DollarSign, 
  Tag, 
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  Users,
  UserRound,
  Calendar,
  Check,
  Pencil,
  Trash2
} from 'lucide-react';
import { useBjj } from '../context/BjjContext';
import { AcademyProduct } from '../types';

export const Produtos: React.FC = () => {
  const {
    products,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    purchases,
    students,
    currentUser,
    addPurchase
  } = useBjj();

  const isProfessor = currentUser.role === 'professor';
  const isStudent = currentUser.role === 'aluno';
  const currentStudent = students.find(s => s.id === currentUser.studentId) || students[0];

  const myStudents = isProfessor 
    ? students.filter(s => s.professorId === currentUser.professorId || (s.professorNome && s.professorNome.toLowerCase() === currentUser.nome.toLowerCase()))
    : students;

  const [activeTab, setActiveTab] = useState<'catalogo' | 'vendas'>('catalogo');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleSuccessMsg, setSaleSuccessMsg] = useState<string | null>(null);

  // New product form
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<'Kimono' | 'Faixa' | 'Rashguard' | 'Acessórios' | 'Bebidas/Nutrição'>('Kimono');
  const [preco, setPreco] = useState(150);
  const [estoque, setEstoque] = useState(10);
  const [tamanho, setTamanho] = useState('A2');

  // New direct sale form
  const [selectedStudentForSale, setSelectedStudentForSale] = useState(myStudents[0]?.id || '');
  const [selectedProductForSale, setSelectedProductForSale] = useState(products[0]?.id || '');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'all' || p.categoria === filterCat;
    return matchesSearch && matchesCat;
  });

  // Filtered sales history based on role
  const scopedPurchases = purchases.filter(pur => {
    if (isProfessor) {
      return myStudents.some(s => s.id === pur.studentId) || pur.professorId === currentUser.professorId;
    }
    if (isStudent) {
      return pur.studentId === currentStudent?.id;
    }
    return true; // Admin: all sales
  });

  const totalVendasValor = scopedPurchases.reduce((acc, p) => acc + p.preco, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const productData = {
      nome,
      categoria,
      preco: Number(preco),
      estoque: Number(estoque),
      tamanho
    };
    if (editingProductId) {
      updateProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }

    resetProductForm();
  };

  const handleEditProduct = (product: AcademyProduct) => {
    setEditingProductId(product.id);
    setNome(product.nome);
    setCategoria(product.categoria);
    setPreco(product.preco);
    setEstoque(product.estoque);
    setTamanho(product.tamanho || '');
    setShowAddModal(true);
  };

  const handleDeleteProduct = (product: AcademyProduct) => {
    if (window.confirm(`Remover "${product.nome}" do catálogo? O histórico de vendas será mantido.`)) {
      deleteProduct(product.id);
    }
  };

  const resetProductForm = () => {
    setShowAddModal(false);
    setEditingProductId(null);
    setNome('');
    setCategoria('Kimono');
    setPreco(150);
    setEstoque(10);
    setTamanho('A2');
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForSale || !selectedProductForSale) return;

    addPurchase(selectedProductForSale, selectedStudentForSale);
    setShowSaleModal(false);
    setSaleSuccessMsg('Venda registrada com sucesso e estoque atualizado!');
    setTimeout(() => setSaleSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            {isProfessor ? 'Área Docente • Vendas & Loja' : 'Loja & Equipamentos'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isProfessor ? `Vendas de Equipamentos • Prof. ${currentUser.nome}` : 'Produtos & Estoque da Academia'}
          </h1>
          <p className="text-sm text-slate-500">
            {isProfessor 
              ? 'Registre vendas de kimonos, faixas e vestuário para os seus alunos vinculados com repasse direto via PIX.'
              : 'Kimonos trançados, faixas oficiais, rashguards para No-Gi e suprimentos para os alunos.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {!isStudent && (
            <button
              onClick={() => setShowSaleModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <DollarSign className="w-4 h-4" />
              Registrar Venda para Aluno
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Produto no Estoque
            </button>
          )}
        </div>
      </div>

      {saleSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {saleSuccessMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('catalogo')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'catalogo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Catálogo & Estoque ({filteredProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('vendas')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'vendas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isProfessor ? 'Minhas Vendas Realizadas' : 'Histórico Geral de Vendas'} ({scopedPurchases.length})
        </button>
      </div>

      {activeTab === 'catalogo' ? (
        <>
          {/* Official Campaign Hero Banner */}
          <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-bold">
                  <span>🥋</span>
                  <span>Coleção Oficial de Marketing 2026</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-theme-main tracking-tight">
                  Mikalkenas Jiu Jitsu — Linha de Kimonos & Rash Guards
                </h2>
                <p className="text-xs md:text-sm text-theme-muted leading-relaxed">
                  "DISCIPLINA • RESPEITO • EVOLUÇÃO — MAIS QUE UM ESPORTE, UM ESTILO DE VIDA."
                  Equipamentos desenvolvidos para alta performance no tatame, durabilidade em treino pesado e conformidade com os regulamentos de competição.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => setFilterCat('Kimono')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterCat === 'Kimono'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-theme-main border border-theme'
                    }`}
                  >
                    Ver Kimonos Trançados (4 Cores)
                  </button>
                  <button
                    onClick={() => setFilterCat('Rashguard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      filterCat === 'Rashguard'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-theme-main border border-theme'
                    }`}
                  >
                    Ver Rash Guards por Faixa
                  </button>
                  {filterCat !== 'all' && (
                    <button
                      onClick={() => setFilterCat('all')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-theme-muted hover:text-theme-main transition-all"
                    >
                      Exibir Todos
                    </button>
                  )}
                </div>
              </div>

              {/* Campaign Previews */}
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 max-w-md">
                <div className="relative rounded-2xl overflow-hidden border border-theme group bg-black/40">
                  <img 
                    src="/assets/aistudio/Mikalkenas_Kimonos_3db0a11f.jpeg" 
                    alt="Linha Oficial de Kimonos" 
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white leading-tight">Kimonos Oficiais</span>
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-theme group bg-black/40">
                  <img 
                    src="/assets/aistudio/Mikalkenas_Rash_Guards_e30540cb.jpeg" 
                    alt="Linha Oficial Rash Guards" 
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white leading-tight">Rash Guards por Faixa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="bg-theme-card rounded-2xl p-4 border border-theme shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar item da loja..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs bg-theme-app border border-theme rounded-xl px-3.5 py-2 pl-9 text-theme-main focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-theme-muted absolute left-3 top-2.5" />
              </div>

              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="text-xs bg-theme-app border border-theme rounded-xl p-2 font-semibold text-theme-main"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Kimono">Kimonos</option>
                <option value="Faixa">Faixas</option>
                <option value="Rashguard">Rashguards</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Bebidas/Nutrição">Bebidas & Nutrição</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(prod => (
              <div 
                key={prod.id}
                className="bg-theme-card rounded-2xl border border-theme shadow-xs hover:border-amber-400/50 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Product Image preview if exists */}
                  {prod.imagem ? (
                    <div className="relative aspect-4/3 overflow-hidden bg-black/30 border-b border-theme">
                      <img 
                        src={prod.imagem} 
                        alt={prod.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white">
                        {prod.categoria}
                      </span>
                    </div>
                  ) : (
                    <div className="p-5 pb-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        {prod.categoria}
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-sm text-theme-main leading-snug line-clamp-2">{prod.nome}</h3>

                    {prod.tamanho && (
                      <p className="text-xs text-theme-muted">Tamanhos: <strong className="text-theme-main">{prod.tamanho}</strong></p>
                    )}

                    <div className="text-xl font-black text-theme-main pt-1">
                      R$ {prod.preco.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="bg-black/10 p-4 border-t border-theme flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-theme-muted block text-[11px]">Estoque:</span>
                    <span className={`font-mono font-bold ${prod.estoque < 5 ? 'text-rose-500' : 'text-theme-main'}`}>
                      {prod.estoque} un
                    </span>
                  </div>

                  {!isStudent ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateProductStock(prod.id, -1)}
                        disabled={prod.estoque <= 0}
                        className="w-7 h-7 rounded-lg bg-theme-card border border-theme hover:bg-white/10 flex items-center justify-center font-bold text-xs disabled:opacity-40 text-theme-main"
                        title="Diminuir Estoque"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateProductStock(prod.id, 1)}
                        className="w-7 h-7 rounded-lg bg-theme-card border border-theme hover:bg-white/10 flex items-center justify-center font-bold text-xs text-theme-main"
                        title="Aumentar Estoque"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addPurchase(prod.id, currentStudent.id)}
                      disabled={prod.estoque <= 0}
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Comprar
                    </button>
                  )}
                </div>
                {currentUser.role === 'admin' && (
                  <div className="px-4 pb-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(prod)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-theme px-2.5 py-1.5 text-xs font-semibold text-theme-main hover:bg-theme-card-hover"
                      aria-label={`Editar ${prod.nome}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10"
                      aria-label={`Remover ${prod.nome}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Sales History View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total de Itens Vendidos</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{scopedPurchases.length}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Kimonos, faixas e vestuário</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Faturamento em Vendas</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">R$ {totalVendasValor.toFixed(2)}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{isProfessor ? 'Repasse direto ao professor' : 'Total da academia'}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Alunos Atendidos</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">
                {new Set(scopedPurchases.map(p => p.studentId)).size}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Praticantes equipados</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-900">
                {isProfessor ? `Vendas Vinculadas aos seus Alunos (${scopedPurchases.length})` : `Quadro Geral de Vendas (${scopedPurchases.length})`}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50/50">
                    <th className="p-3.5">Data</th>
                    <th className="p-3.5">Aluno</th>
                    <th className="p-3.5">Produto</th>
                    <th className="p-3.5">Valor</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scopedPurchases.map(pur => (
                    <tr key={pur.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5 text-slate-500 font-mono">
                        {new Date(pur.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{pur.studentNome}</td>
                      <td className="p-3.5 text-slate-700 font-medium">{pur.produtoNome}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">R$ {pur.preco.toFixed(2)}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Pago
                        </span>
                      </td>
                    </tr>
                  ))}
                  {scopedPurchases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Nenhuma venda registrada até o momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Direct Sale */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Registrar Venda para Aluno</h3>
                <p className="text-xs text-slate-500">
                  {isProfessor ? 'Venda para aluno sob sua responsabilidade' : 'Venda direta da loja'}
                </p>
              </div>
              <button onClick={() => setShowSaleModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Selecionar Aluno</label>
                <select
                  value={selectedStudentForSale}
                  onChange={(e) => setSelectedStudentForSale(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                  required
                >
                  {myStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nome} ({s.faixa})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Produto / Equipamento</label>
                <select
                  value={selectedProductForSale}
                  onChange={(e) => setSelectedProductForSale(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.estoque <= 0}>
                      {p.nome} - R$ {p.preco.toFixed(2)} ({p.estoque} em estoque)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Controle Automático:</span>
                <p className="text-[11px] text-blue-800">
                  O item será descontado automaticamente do estoque da academia e associado ao cadastro do atleta.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSaleModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Product (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">{editingProductId ? 'Editar Produto' : 'Novo Produto no Estoque'}</h3>
              <button onClick={resetProductForm} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome do Item</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Kimono Trançado Especial Branco"
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="Kimono">Kimono</option>
                    <option value="Faixa">Faixa</option>
                    <option value="Rashguard">Rashguard</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Bebidas/Nutrição">Bebidas/Nutrição</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tamanho(s)</label>
                  <input
                    type="text"
                    value={tamanho}
                    onChange={(e) => setTamanho(e.target.value)}
                    placeholder="A1, A2, A3 ou Único"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Preço Unitário (R$)</label>
                  <input
                    type="number"
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    value={estoque}
                    onChange={(e) => setEstoque(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {editingProductId ? 'Salvar Alterações' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
