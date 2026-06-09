import React, { useState, useEffect } from 'react';

interface VisualizacaoPageProps {
  patrimonio?: any;
  onNavigate: (page: string) => void;
}

export default function VisualizacaoPage({ patrimonio, onNavigate }: VisualizacaoPageProps) {
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    if (patrimonio?.ID_PATRIMONIO) {
      // Simular geração de QR Code (em produção, usar biblioteca qrcode)
      setQrCode(`QR-${patrimonio.ID_PATRIMONIO}`);
    }
  }, [patrimonio]);

  if (!patrimonio) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Nenhum patrimônio selecionado</p>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-primary">
            Voltar
          </button>
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
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #990033 0%, #660022 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            PATRIMÔNIO
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Hospital Regional de Ponta Porã
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* QR Code Area */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              background: '#f0f0f0',
              border: '2px solid var(--color-border)',
              borderRadius: '0.5rem',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <div>QR Code</div>
              </div>
            </div>

            {/* ID Box */}
            <div style={{
              background: '#000000',
              color: 'white',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem',
              minHeight: '120px',
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                fontFamily: 'monospace',
                textAlign: 'center',
                wordBreak: 'break-all',
              }}>
                {patrimonio.ID_PATRIMONIO}
              </div>
            </div>
          </div>

          {/* Informações */}
          <div style={{
            borderTop: '2px solid var(--color-border)',
            paddingTop: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              marginBottom: '1rem',
            }}>
              Informações
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.25rem',
                }}>
                  Descrição
                </label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text)' }}>
                  {patrimonio.DESCRICAO}
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.25rem',
                }}>
                  Centro de Custo
                </label>
                <p style={{ fontSize: '1rem', color: 'var(--color-text)' }}>
                  {patrimonio.CENTRO_CUSTO}
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.25rem',
                }}>
                  Status
                </label>
                <p style={{
                  fontSize: '1rem',
                  color: patrimonio.STATUS === 'ATIVO' ? 'var(--color-success)' : 'var(--color-error)',
                  fontWeight: '600',
                }}>
                  {patrimonio.STATUS}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          background: '#f9f8f6',
          padding: '1rem',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)',
        }}>
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-primary">
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
