import React, { useState, useEffect } from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

interface Stats {
  total: number;
  ativos: number;
  inativos: number;
  por_tipo: Record<string, number>;
  por_centro: Record<string, number>;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

    setLoading(true);
    try {
      // Carrega estatísticas
      const statsResponse = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'estatisticas' }),
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Carrega patrimônios
      const patResponse = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'listar' }),
      });
      const patData = await patResponse.json();
      setPatrimonios(Array.isArray(patData) ? patData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #990033 0%, #660022 100%)',
        color: 'white',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            PAT.HOSP
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>
            Sistema de Controle de Patrimônio Hospitalar
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                {stats.total}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                Total de Patrimônios
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>
                {stats.ativos}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                Patrimônios Ativos
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#DC2626', marginBottom: '0.5rem' }}>
                {stats.inativos}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                Patrimônios Inativos
              </p>
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div
            onClick={() => onNavigate('patrimonios')}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(153, 0, 51, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Patrimônios
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Visualizar e gerenciar patrimônios
            </p>
          </div>

          <div
            onClick={() => onNavigate('importacao')}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(153, 0, 51, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Importar
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Importar patrimônios via CSV
            </p>
          </div>

          <div
            onClick={() => onNavigate('etiquetas')}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(153, 0, 51, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Etiquetas
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Gerar etiquetas com QR Code
            </p>
          </div>

          <div
            onClick={() => onNavigate('configuracoes')}
            className="card"
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: '2rem',
              textAlign: 'center',
              border: '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(153, 0, 51, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Configurações
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Configurar API e preferências
            </p>
          </div>
        </div>

        {/* Patrimônios List */}
        {patrimonios.length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Últimos Patrimônios Cadastrados
            </h2>
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
                  </tr>
                </thead>
                <tbody>
                  {patrimonios.slice(0, 5).map((p, idx) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
