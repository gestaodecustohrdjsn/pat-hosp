import React, { useState } from 'react';

interface ConfiguracoesPageProps {
  onNavigate: (page: string) => void;
}

export default function ConfiguracoesPage({ onNavigate }: ConfiguracoesPageProps) {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('pat_hosp_api_url') || '');
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');

  const handleTest = async () => {
    if (!apiUrl) {
      setMessage('❌ Digite a URL da API');
      return;
    }

    setTesting(true);
    setMessage('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'test' }),
      });

      if (response.ok) {
        localStorage.setItem('pat_hosp_api_url', apiUrl);
        setMessage('✅ Conexão estabelecida com sucesso!');
      } else {
        setMessage('❌ Falha na conexão com a API');
      }
    } catch (error) {
      setMessage('❌ Erro ao testar conexão: ' + (error as Error).message);
    } finally {
      setTesting(false);
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Configurações</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            API Google Apps Script
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--color-text)',
            }}>
              URL da API
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="input"
              style={{
                padding: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                width: '100%',
              }}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
              Cole a URL do seu Google Apps Script publicado
            </p>
          </div>

          <button
            onClick={handleTest}
            disabled={testing}
            className="btn btn-primary"
            style={{
              width: '100%',
              opacity: testing ? 0.6 : 1,
              cursor: testing ? 'not-allowed' : 'pointer',
            }}>
            {testing ? 'Testando...' : 'Testar Conexão'}
          </button>

          {message && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.includes('✅') ? 'var(--color-success)' : 'var(--color-error)',
              fontWeight: '600',
            }}>
              {message}
            </div>
          )}

          {localStorage.getItem('pat_hosp_api_url') && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '0.5rem',
              borderLeft: '4px solid var(--color-success)',
            }}>
              <p style={{ color: 'var(--color-success)', fontWeight: '600' }}>
                ✓ API configurada com sucesso
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
