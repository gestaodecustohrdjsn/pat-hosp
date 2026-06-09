import React from 'react';

export default function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid var(--color-primary)',
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <span style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
