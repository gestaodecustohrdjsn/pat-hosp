import React, { useState, useEffect } from 'react';

interface EtiquetasPageProps {
  onNavigate: (page: string) => void;
}

export default function EtiquetasPage({ onNavigate }: EtiquetasPageProps) {
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    carregarPatrimonios();
  }, []);

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

  const toggleSelecao = (id: string) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selecionarTodos = () => {
    if (selecionados.length === patrimonios.length) {
      setSelecionados([]);
    } else {
      setSelecionados(patrimonios.map(p => p.ID_PATRIMONIO));
    }
  };

  const gerarQRCode = (id: string) => {
    const url = `${window.location.origin}/pat-hosp/patrimonio/${id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const imprimirEtiquetas = () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um patrimônio');
      return;
    }

    const etiquetasHTML = selecionados.map(id => {
      const patrimonio = patrimonios.find(p => p.ID_PATRIMONIO === id);
      if (!patrimonio) return '';

      return `
        <div style="
          page-break-after: always;
          width: 200mm;
          height: 100mm;
          display: flex;
          border: 2px solid #000;
          margin: 10mm;
          background: white;
          font-family: Arial, sans-serif;
        ">
          <!-- QR Code (esquerda) -->
          <div style="
            width: 70mm;
            height: 100mm;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 2px solid #000;
            padding: 5mm;
          ">
            <img src="${gerarQRCode(id)}" style="width: 60mm; height: 60mm;" />
          </div>

          <!-- Conteúdo (direita) -->
          <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10mm;
          ">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 10mm;">
              <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #000;">
                PATRIMÔNIO
              </h2>
              <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5mm;
                margin-top: 5mm;
              ">
                <div style="
                  width: 15mm;
                  height: 15mm;
                  border: 2px solid #000;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  font-weight: bold;
                ">+</div>
                <span style="font-size: 12px; font-weight: bold;">HOSPITAL<br/>REGIONAL<br/>DE PONTA PORÃ</span>
              </div>
            </div>

            <!-- Informações -->
            <div style="
              font-size: 11px;
              line-height: 1.6;
              margin-bottom: 10mm;
            ">
              <p style="margin: 0;"><strong>Descrição:</strong> ${patrimonio.DESCRICAO}</p>
              <p style="margin: 0;"><strong>Centro:</strong> ${patrimonio.CENTRO_CUSTO}</p>
              <p style="margin: 0;"><strong>Tipo:</strong> ${patrimonio.TIPO}</p>
            </div>

            <!-- ID (caixa preta) -->
            <div style="
              background-color: #000;
              color: white;
              padding: 8mm;
              text-align: center;
              border-radius: 3mm;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 2px;
              font-family: monospace;
            ">
              ${patrimonio.ID_PATRIMONIO}
            </div>
          </div>
        </div>
      `;
    }).join('');

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              div { page-break-inside: avoid; }
            }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${etiquetasHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Gerar Etiquetas</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Seleção */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Selecione os Patrimônios
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={selecionarTodos}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                marginRight: '1rem',
              }}>
              {selecionados.length === patrimonios.length ? '❌ Desselecionar Todos' : '✓ Selecionar Todos'}
            </button>
            <span style={{ fontWeight: '600', color: 'var(--color-text-secondary)' }}>
              {selecionados.length} de {patrimonios.length} selecionados
            </span>
          </div>

          {/* Lista */}
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '0.5rem', padding: '1rem' }}>
            {patrimonios.map((p, idx) => (
              <label key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                cursor: 'pointer',
                borderBottom: idx < patrimonios.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <input
                  type="checkbox"
                  checked={selecionados.includes(p.ID_PATRIMONIO)}
                  onChange={() => toggleSelecao(p.ID_PATRIMONIO)}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                    {p.ID_PATRIMONIO}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {p.DESCRICAO}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setPreview(!preview)}
              style={{
                background: '#D4AF37',
                color: '#333',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
              }}>
              👁️ {preview ? 'Ocultar' : 'Visualizar'} Preview
            </button>
            <button
              onClick={imprimirEtiquetas}
              disabled={selecionados.length === 0}
              style={{
                background: selecionados.length === 0 ? '#ccc' : 'var(--color-primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: selecionados.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
              }}>
              🖨️ Imprimir Etiquetas ({selecionados.length})
            </button>
          </div>
        </div>

        {/* Preview */}
        {preview && selecionados.length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Preview - Primeira Etiqueta
            </h2>

            {(() => {
              const patrimonio = patrimonios.find(p => p.ID_PATRIMONIO === selecionados[0]);
              if (!patrimonio) return null;

              return (
                <div style={{
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto',
                  border: '2px solid #000',
                  display: 'flex',
                  backgroundColor: 'white',
                  fontFamily: 'Arial, sans-serif',
                }}>
                  {/* QR Code */}
                  <div style={{
                    width: '35%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '2px solid #000',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                  }}>
                    <img
                      src={gerarQRCode(patrimonio.ID_PATRIMONIO)}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h2 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>
                        PATRIMÔNIO
                      </h2>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', lineHeight: '1.4' }}>
                        HOSPITAL REGIONAL<br/>DE PONTA PORÃ
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', lineHeight: '1.6', marginBottom: '20px' }}>
                      <p style={{ margin: '0 0 5px 0' }}>
                        <strong>Descrição:</strong> {patrimonio.DESCRICAO}
                      </p>
                      <p style={{ margin: '0 0 5px 0' }}>
                        <strong>Centro:</strong> {patrimonio.CENTRO_CUSTO}
                      </p>
                      <p style={{ margin: '0' }}>
                        <strong>Tipo:</strong> {patrimonio.TIPO}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: '#000',
                      color: 'white',
                      padding: '12px',
                      textAlign: 'center',
                      borderRadius: '4px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      fontFamily: 'monospace',
                    }}>
                      {patrimonio.ID_PATRIMONIO}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
}
