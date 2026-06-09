import React, { useState } from 'react';

interface PatrimoniosPageProps {
  onNavigate: (page: string) => void;
}

export default function PatrimoniosPage({ onNavigate }: PatrimoniosPageProps) {
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCarregar = async () => {
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
      alert('Erro ao carregar patrimônios: ' + (error as Error).message);
    } finally {
      setLoading(false);
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
        <button
          onClick={handleCarregar}
          disabled={loading}
          className="btn btn-primary"
          style={{ marginBottom: '2rem' }}>
          {loading ? 'Carregando...' : 'Carregar Patrimônios'}
        </button>

        {patrimonios.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>
              Nenhum patrimônio carregado. Clique em "Carregar Patrimônios" para sincronizar.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Descrição</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Centro de Custo</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {patrimonios.map((p, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f8f6',
                  }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--color-primary)' }}>
                      {p.ID_PATRIMONIO}
                    </td>
                    <td style={{ padding: '1rem' }}>{p.DESCRICAO}</td>
                    <td style={{ padding: '1rem' }}>{p.CENTRO_CUSTO}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${p.STATUS === 'ATIVO' ? 'badge-success' : 'badge-error'}`}>
                        {p.STATUS}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
