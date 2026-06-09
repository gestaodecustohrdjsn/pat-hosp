import React from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #990033 0%, #660022 100%)',
        color: 'white',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            PAT.HOSP
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Sistema de Controle de Patrimônio Hospitalar
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem 1rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
          }}>
            {/* Card Patrimônios */}
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => onNavigate('patrimonios')}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Patrimônios
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Gerenciar e consultar todos os patrimônios do hospital
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Acessar
              </button>
            </div>

            {/* Card Etiquetas */}
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => onNavigate('etiquetas')}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Etiquetas
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Gerar e imprimir etiquetas com QR Code
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Acessar
              </button>
            </div>

            {/* Card Configurações */}
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              onClick={() => onNavigate('configuracoes')}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                Configurações
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Conectar Google Apps Script e configurar API
              </p>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Acessar
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(153, 0, 51, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%)',
            borderRadius: '0.75rem',
            borderLeft: '4px solid var(--color-primary)',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Bem-vindo ao PAT.HOSP
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Sistema completo para gerenciar o patrimônio do Hospital Regional de Ponta Porã. 
              Controle de bens, movimentações, histórico e geração de etiquetas com QR Code para rastreamento.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-primary)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '2rem',
      }}>
        <div className="container">
          <p>© 2026 Hospital Regional de Ponta Porã - PAT.HOSP v2.0</p>
        </div>
      </footer>
    </div>
  );
}
