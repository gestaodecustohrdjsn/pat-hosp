import React, { useState } from 'react';

interface ImportacaoPageProps {
  onNavigate: (page: string) => void;
}

export default function ImportacaoPage({ onNavigate }: ImportacaoPageProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');

  const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      lerCSV(file);
    }
  };

  const lerCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const linhas = csv.split('\n').filter(l => l.trim());
      const headers = linhas[0].split(',').map(h => h.trim());
      
      const dados = [];
      for (let i = 1; i < Math.min(linhas.length, 6); i++) {
        const valores = linhas[i].split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h.toLowerCase()] = valores[idx];
        });
        dados.push(obj);
      }
      
      setPreview(dados);
    };
    reader.readAsText(file);
  };

  const handleImportar = async () => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) {
      alert('Configure a API primeiro em Configurações');
      onNavigate('configuracoes');
      return;
    }

    if (!arquivo) {
      alert('Selecione um arquivo CSV');
      return;
    }

    setLoading(true);
    setResultado('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csv = event.target?.result as string;
        const linhas = csv.split('\n').filter(l => l.trim());
        const headers = linhas[0].split(',').map(h => h.trim().toLowerCase());
        
        const patrimonios = [];
        for (let i = 1; i < linhas.length; i++) {
          const valores = linhas[i].split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((h, idx) => {
            obj[h] = valores[idx];
          });
          if (obj.descricao) patrimonios.push(obj);
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'importar', patrimonios }),
        });

        const data = await response.json();
        if (data.success) {
          setResultado(`✅ ${data.total} patrimônios importados com sucesso!`);
        } else {
          setResultado(`❌ Erro na importação: ${data.error}`);
        }
      };
      reader.readAsText(arquivo);
    } catch (error) {
      setResultado(`❌ Erro: ${(error as Error).message}`);
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
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Importar Patrimônios</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Upload Section */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Selecione um arquivo CSV
            </h2>

            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
              <input
                type="file"
                accept=".csv"
                onChange={handleArquivo}
                style={{ display: 'none' }}
                id="csv-input"
              />
              <label htmlFor="csv-input" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {arquivo ? arquivo.name : 'Clique para selecionar ou arraste um arquivo'}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Formato: CSV com colunas: descricao, tipo, centro_custo, data_aquisicao, valor
                </p>
              </label>
            </div>

            {preview.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Preview (primeiras linhas)
                </h3>
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                        {Object.keys(preview[0]).map(key => (
                          <th key={key} style={{ padding: '0.5rem', textAlign: 'left' }}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          {Object.values(row).map((val: any, vidx) => (
                            <td key={vidx} style={{ padding: '0.5rem' }}>
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleImportar}
              disabled={!arquivo || loading}
              className="btn btn-primary"
              style={{ width: '100%' }}>
              {loading ? 'Importando...' : '📥 Importar Patrimônios'}
            </button>
          </div>

          {/* Result */}
          {resultado && (
            <div className="card" style={{
              backgroundColor: resultado.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderLeft: `4px solid ${resultado.includes('✅') ? 'var(--color-success)' : 'var(--color-error)'}`,
            }}>
              <p style={{
                color: resultado.includes('✅') ? 'var(--color-success)' : 'var(--color-error)',
                fontWeight: '600',
              }}>
                {resultado}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
