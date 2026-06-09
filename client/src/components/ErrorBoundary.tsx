import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg)',
          padding: '2rem',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            textAlign: 'center',
          }}>
            <h1 style={{ color: '#DC2626', marginBottom: '1rem' }}>
              ⚠️ Erro na Aplicação
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '0.25rem',
                fontSize: '0.8rem',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}>
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
