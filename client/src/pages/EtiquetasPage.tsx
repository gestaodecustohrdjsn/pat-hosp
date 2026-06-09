import React, { useState } from 'react';

interface EtiquetasPageProps {
  onNavigate: (page: string) => void;
}

export default function EtiquetasPage({ onNavigate }: EtiquetasPageProps) {
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [inputId, setInputId] = useState('');

  const handleAdicionar = () => {
    if (inputId.trim()) {
      setEtiquetas([...etiquetas, inputId]);
      setInputId('');
    }
  };

  const handleRemover = (idx: number) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== idx));
  };

  const handleImprimir = () => {
    window.print();
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Gerar Etiquetas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Adicionar IDs
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdicionar()}
                placeholder="Digite o ID do patrimônio"
                className="input"
                style={{ flex: 1 }}
              />
              <button
                onClick={handleAdicionar}
                className="btn btn-primary">
                Adicionar
              </button>
            </div>

            {etiquetas.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  {etiquetas.length} etiqueta(s) selecionada(s)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {etiquetas.map((id, idx) => (
                    <div key={idx} style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span>{id}</span>
                      <button
                        onClick={() => handleRemover(idx)}
                        style={{
                          background: 'rgba(255,255,255,0.3)',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etiquetas.length > 0 && (
              <button
                onClick={handleImprimir}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '1rem' }}>
                🖨️ Imprimir Etiquetas
              </button>
            )}
          </div>
        </div>

        {/* Preview */}
        {etiquetas.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Preview
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}>
              {etiquetas.map((id, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  border: '2px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  aspectRatio: '2',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {/* QR Code Area */}
                  <div style={{
                    background: '#f0f0f0',
                    border: '2px solid var(--color-border)',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                  }}>
                    📱 QR
                  </div>

                  {/* ID Area */}
                  <div style={{
                    background: '#000000',
                    color: 'white',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      wordBreak: 'break-all',
                    }}>
                      {id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          header, .container > div:first-child, h2 {
            display: none;
          }
          .container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
