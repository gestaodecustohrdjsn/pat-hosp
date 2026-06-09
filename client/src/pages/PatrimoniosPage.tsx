import React, { useState, useEffect } from 'react';

interface PatrimoniosPageProps {
  onNavigate: (page: string, patrimonio?: any) => void;
}

interface Patrimonio {
  ID_PATRIMONIO: string;
  DESCRICAO: string;
  TIPO: string;
  CENTRO_CUSTO: string;
  DATA_AQUISICAO: string;
  VALOR: number;
  STATUS: string;
  DATA_CADASTRO: string;
  OBSERVACOES: string;
}

export default function PatrimoniosPage({ onNavigate }: PatrimoniosPageProps) {
  const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
  const [filtrados, setFiltrados] = useState<Patrimonio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'move' | 'delete'>('add');
  const [selectedPatrimonio, setSelectedPatrimonio] = useState<Patrimonio | null>(null);
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'GER',
    centro_custo: '0001',
    data_aquisicao: '',
    valor: 0,
    observacoes: '',
  });
  const [filtro, setFiltro] = useState({
    status: 'TODOS',
    centro: 'TODOS',
    busca: '',
  });

  useEffect(() => {
    carregarPatrimonios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [patrimonios, filtro]);

  const carregarPatrimonios = async () => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) {
      alert('Configure a API primeiro em Configurações');
      onNavigate('configuracoes');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'listar' }),
      });
      const data = await response.json();
      setPatrimonios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar patrimônios:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = patrimonios;

    if (filtro.status !== 'TODOS') {
      resultado = resultado.filter(p => p.STATUS === filtro.status);
    }

    if (filtro.centro !== 'TODOS') {
      resultado = resultado.filter(p => p.CENTRO_CUSTO === filtro.centro);
    }

    if (filtro.busca) {
      resultado = resultado.filter(p =>
        p.ID_PATRIMONIO.toLowerCase().includes(filtro.busca.toLowerCase()) ||
        p.DESCRICAO.toLowerCase().includes(filtro.busca.toLowerCase())
      );
    }

    setFiltrados(resultado);
  };

  const handleAdicionarPatrimonio = async () => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'adicionar', ...formData }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`✅ Patrimônio adicionado! ID: ${data.id}`);
        setShowModal(false);
        setFormData({ descricao: '', tipo: 'GER', centro_custo: '0001', data_aquisicao: '', valor: 0, observacoes: '' });
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao adicionar patrimônio');
    }
  };

  const handleEditarPatrimonio = async () => {
    if (!selectedPatrimonio) return;
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'editar', id: selectedPatrimonio.ID_PATRIMONIO, ...formData }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Patrimônio editado com sucesso!');
        setShowModal(false);
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao editar patrimônio');
    }
  };

  const handleRemoverPatrimonio = async () => {
    if (!selectedPatrimonio) return;
    if (!window.confirm('Tem certeza que deseja remover este patrimônio?')) return;

    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'remover', id: selectedPatrimonio.ID_PATRIMONIO }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Patrimônio removido com sucesso!');
        setShowModal(false);
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao remover patrimônio');
    }
  };

  const handleInativarPatrimonio = async (patrimonio: Patrimonio) => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'inativar', id: patrimonio.ID_PATRIMONIO }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Patrimônio inativado com sucesso!');
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao inativar patrimônio');
    }
  };

  const handleAtivarPatrimonio = async (patrimonio: Patrimonio) => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'ativar', id: patrimonio.ID_PATRIMONIO }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Patrimônio ativado com sucesso!');
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao ativar patrimônio');
    }
  };

  const handleMovimentar = async () => {
    if (!selectedPatrimonio) return;
    const novoCentro = prompt('Digite o novo centro de custo:');
    if (!novoCentro) return;

    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'movimentar',
          id: selectedPatrimonio.ID_PATRIMONIO,
          centro_destino: novoCentro,
          motivo: 'Movimentação manual',
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Patrimônio movimentado com sucesso!');
        setShowModal(false);
        carregarPatrimonios();
      }
    } catch (error) {
      alert('Erro ao movimentar patrimônio');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #990033 0%, #660022 100%)',
        color: 'white',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div className="container">
          <button
            onClick={() => onNavigate('home')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginBottom: '1rem',
              fontSize: '1rem',
            }}>
            ← Voltar
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Patrimônios</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Filtros */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Buscar por ID ou descrição..."
              value={filtro.busca}
              onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}
            />
            <select
              value={filtro.status}
              onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}>
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVO">Ativos</option>
              <option value="INATIVO">Inativos</option>
            </select>
            <select
              value={filtro.centro}
              onChange={(e) => setFiltro({ ...filtro, centro: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}>
              <option value="TODOS">Todos os Centros</option>
              <option value="0001">Centro 0001</option>
              <option value="0002">Centro 0002</option>
            </select>
            <button
              onClick={() => {
                setModalType('add');
                setSelectedPatrimonio(null);
                setFormData({ descricao: '', tipo: 'GER', centro_custo: '0001', data_aquisicao: '', valor: 0, observacoes: '' });
                setShowModal(true);
              }}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
              }}>
              ➕ Adicionar
            </button>
          </div>

          {/* Tabela */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Carregando...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Centro</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {p.ID_PATRIMONIO}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{p.DESCRICAO}</td>
                      <td style={{ padding: '0.75rem' }}>{p.CENTRO_CUSTO}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          backgroundColor: p.STATUS === 'ATIVO' ? '#10B98133' : '#DC262633',
                          color: p.STATUS === 'ATIVO' ? '#10B981' : '#DC2626',
                          fontWeight: '600',
                          fontSize: '0.8rem',
                        }}>
                          {p.STATUS}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedPatrimonio(p);
                            setFormData({
                              descricao: p.DESCRICAO,
                              tipo: p.TIPO,
                              centro_custo: p.CENTRO_CUSTO,
                              data_aquisicao: p.DATA_AQUISICAO,
                              valor: p.VALOR,
                              observacoes: p.OBSERVACOES,
                            });
                            setModalType('edit');
                            setShowModal(true);
                          }}
                          style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginRight: '0.25rem',
                          }}>
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatrimonio(p);
                            handleMovimentar();
                          }}
                          style={{
                            background: '#D4AF37',
                            color: '#333',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginRight: '0.25rem',
                          }}>
                          🚚
                        </button>
                        {p.STATUS === 'ATIVO' ? (
                          <button
                            onClick={() => handleInativarPatrimonio(p)}
                            style={{
                              background: '#DC2626',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}>
                            ⏸️
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAtivarPatrimonio(p)}
                            style={{
                              background: '#10B981',
                              color: 'white',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '0.3rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                            }}>
                            ▶️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              {modalType === 'add' ? 'Adicionar Patrimônio' : 'Editar Patrimônio'}
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Descrição</label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tipo</label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Centro de Custo</label>
                <input
                  type="text"
                  value={formData.centro_custo}
                  onChange={(e) => setFormData({ ...formData, centro_custo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Data de Aquisição</label>
                <input
                  type="date"
                  value={formData.data_aquisicao}
                  onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Valor</label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'var(--color-border)',
                  color: 'var(--color-text)',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                }}>
                Cancelar
              </button>
              {modalType === 'add' && (
                <button
                  onClick={handleAdicionarPatrimonio}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}>
                  Adicionar
                </button>
              )}
              {modalType === 'edit' && (
                <>
                  <button
                    onClick={handleRemoverPatrimonio}
                    style={{
                      background: '#DC2626',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}>
                    Remover
                  </button>
                  <button
                    onClick={handleEditarPatrimonio}
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}>
                    Salvar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
