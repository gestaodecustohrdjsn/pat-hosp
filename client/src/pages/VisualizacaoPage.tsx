import React, { useState, useEffect } from 'react';

interface VisualizacaoPageProps {
  patrimonio_id?: string;
}

export default function VisualizacaoPage({ patrimonio_id }: VisualizacaoPageProps) {
  const [patrimonio, setPatrimonio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [camposExibicao, setCamposExibicao] = useState({
    descricao: true,
    centro: true,
    data_aquisicao: true,
    valor: true,
    tipo: true,
    status: true,
  });

  useEffect(() => {
    carregarPatrimonio();
  }, [patrimonio_id]);

  const carregarPatrimonio = async () => {
    const id = patrimonio_id || new URLSearchParams(window.location.search).get('id');
    if (!id) {
      setLoading(false);
      return;
    }

    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'obter', id }),
      });
      const data = await response.json();
      setPatrimonio(data);
    } catch (error) {
      console.error('Erro ao carregar patrimônio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid var(--color-primary)',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!patrimonio) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            Patrimônio não encontrado
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            O ID do patrimônio não foi encontrado no sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #990033 0%, #660022 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Card Principal */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header com Dourado */}
        <div style={{
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#333',
          }}>
            PATRIMÔNIO
          </h1>
          <p style={{
            margin: '0',
            fontSize: '0.9rem',
            color: '#555',
            fontWeight: '600',
          }}>
            Hospital Regional de Ponta Porã
          </p>
        </div>

        {/* Espaço para Foto */}
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '2px solid #D4AF37',
          fontSize: '0.9rem',
          color: '#999',
        }}>
          📷 Foto do Patrimônio
        </div>

        {/* Informações */}
        <div style={{ padding: '2rem' }}>
          {/* ID em Destaque */}
          <div style={{
            backgroundColor: '#990033',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '1.3rem',
            fontWeight: '700',
            letterSpacing: '1px',
          }}>
            {patrimonio.ID_PATRIMONIO}
          </div>

          {/* Campos Dinâmicos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {camposExibicao.descricao && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Descrição
                </label>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  {patrimonio.DESCRICAO}
                </p>
              </div>
            )}

            {camposExibicao.centro && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Centro de Custo
                </label>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  {patrimonio.CENTRO_CUSTO}
                </p>
              </div>
            )}

            {camposExibicao.tipo && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Tipo
                </label>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  {patrimonio.TIPO}
                </p>
              </div>
            )}

            {camposExibicao.data_aquisicao && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Data de Aquisição
                </label>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  {patrimonio.DATA_AQUISICAO}
                </p>
              </div>
            )}

            {camposExibicao.valor && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Valor
                </label>
                <p style={{
                  margin: '0',
                  fontSize: '1rem',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  R$ {patrimonio.VALOR?.toFixed(2) || '0.00'}
                </p>
              </div>
            )}

            {camposExibicao.status && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#D4AF37',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.5px',
                }}>
                  Status
                </label>
                <p style={{
                  margin: '0',
                  display: 'inline-block',
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: patrimonio.STATUS === 'ATIVO' ? '#10B98133' : '#DC262633',
                  color: patrimonio.STATUS === 'ATIVO' ? '#10B981' : '#DC2626',
                  fontWeight: '600',
                }}>
                  {patrimonio.STATUS}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '1rem',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          fontSize: '0.8rem',
          color: '#999',
        }}>
          <p style={{ margin: '0' }}>
            Sistema de Gestão de Patrimônio Hospitalar
          </p>
          <p style={{ margin: '0.25rem 0 0 0' }}>
            {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
