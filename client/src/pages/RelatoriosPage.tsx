import React, { useState, useEffect } from 'react';

interface RelatoriosPageProps {
  onNavigate: (page: string) => void;
}

export default function RelatoriosPage({ onNavigate }: RelatoriosPageProps) {
  const [patrimonios, setPatrimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [filtros, setFiltros] = useState({
    centro: 'TODOS',
    status: 'TODOS',
    tipo: 'TODOS',
  });
  const [colunas, setColunas] = useState({
    id: true,
    descricao: true,
    tipo: true,
    centro: true,
    data_aquisicao: true,
    valor: true,
    status: true,
  });

  useEffect(() => {
    carregarPatrimonios();
  }, []);

  const carregarPatrimonios = async () => {
    const apiUrl = localStorage.getItem('pat_hosp_api_url');
    if (!apiUrl) return;

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

  const filtrarDados = () => {
    let resultado = patrimonios;

    if (filtros.centro !== 'TODOS') {
      resultado = resultado.filter(p => p.CENTRO_CUSTO === filtros.centro);
    }
    if (filtros.status !== 'TODOS') {
      resultado = resultado.filter(p => p.STATUS === filtros.status);
    }
    if (filtros.tipo !== 'TODOS') {
      resultado = resultado.filter(p => p.TIPO === filtros.tipo);
    }

    return resultado;
  };

  const exportarExcel = () => {
    const dados = filtrarDados();
    const headers = [];
    const rows = [];

    if (colunas.id) headers.push('ID');
    if (colunas.descricao) headers.push('Descrição');
    if (colunas.tipo) headers.push('Tipo');
    if (colunas.centro) headers.push('Centro de Custo');
    if (colunas.data_aquisicao) headers.push('Data de Aquisição');
    if (colunas.valor) headers.push('Valor');
    if (colunas.status) headers.push('Status');

    rows.push(headers.join('\t'));

    dados.forEach(p => {
      const row = [];
      if (colunas.id) row.push(p.ID_PATRIMONIO);
      if (colunas.descricao) row.push(p.DESCRICAO);
      if (colunas.tipo) row.push(p.TIPO);
      if (colunas.centro) row.push(p.CENTRO_CUSTO);
      if (colunas.data_aquisicao) row.push(p.DATA_AQUISICAO);
      if (colunas.valor) row.push(p.VALOR);
      if (colunas.status) row.push(p.STATUS);
      rows.push(row.join('\t'));
    });

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_patrimonios_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const exportarPDF = () => {
    const dados = filtrarDados();
    const headers = [];
    
    if (colunas.id) headers.push('ID');
    if (colunas.descricao) headers.push('Descrição');
    if (colunas.tipo) headers.push('Tipo');
    if (colunas.centro) headers.push('Centro');
    if (colunas.data_aquisicao) headers.push('Data');
    if (colunas.valor) headers.push('Valor');
    if (colunas.status) headers.push('Status');

    let html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #990033; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #990033; color: white; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .summary { margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Relatório de Patrimônios</h1>
        <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        <p><strong>Total de Registros:</strong> ${dados.length}</p>
        
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${dados.map(p => `
              <tr>
                ${colunas.id ? `<td>${p.ID_PATRIMONIO}</td>` : ''}
                ${colunas.descricao ? `<td>${p.DESCRICAO}</td>` : ''}
                ${colunas.tipo ? `<td>${p.TIPO}</td>` : ''}
                ${colunas.centro ? `<td>${p.CENTRO_CUSTO}</td>` : ''}
                ${colunas.data_aquisicao ? `<td>${p.DATA_AQUISICAO}</td>` : ''}
                ${colunas.valor ? `<td>R$ ${p.VALOR.toFixed(2)}</td>` : ''}
                ${colunas.status ? `<td><span style="padding: 3px 8px; border-radius: 3px; background-color: ${p.STATUS === 'ATIVO' ? '#10B98133' : '#DC262633'}; color: ${p.STATUS === 'ATIVO' ? '#10B981' : '#DC2626'};">${p.STATUS}</span></td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h3>Resumo</h3>
          <p><strong>Total de Patrimônios:</strong> ${dados.length}</p>
          <p><strong>Patrimônios Ativos:</strong> ${dados.filter(p => p.STATUS === 'ATIVO').length}</p>
          <p><strong>Patrimônios Inativos:</strong> ${dados.filter(p => p.STATUS === 'INATIVO').length}</p>
          <p><strong>Valor Total:</strong> R$ ${dados.reduce((sum, p) => sum + p.VALOR, 0).toFixed(2)}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const dados = filtrarDados();

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
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Relatórios</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Filtros */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Filtros
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Centro de Custo</label>
              <select
                value={filtros.centro}
                onChange={(e) => setFiltros({ ...filtros, centro: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                }}>
                <option value="TODOS">Todos</option>
                <option value="0001">Centro 0001</option>
                <option value="0002">Centro 0002</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Status</label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                }}>
                <option value="TODOS">Todos</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Tipo</label>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                }}>
                <option value="TODOS">Todos</option>
                <option value="GER">Geral</option>
                <option value="MED">Médico</option>
              </select>
            </div>
          </div>

          {/* Seleção de Colunas */}
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem' }}>Colunas a Exibir</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {Object.entries(colunas).map(([key, value]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setColunas({ ...colunas, [key]: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500' }}>
                  {key === 'id' && 'ID'}
                  {key === 'descricao' && 'Descrição'}
                  {key === 'tipo' && 'Tipo'}
                  {key === 'centro' && 'Centro'}
                  {key === 'data_aquisicao' && 'Data'}
                  {key === 'valor' && 'Valor'}
                  {key === 'status' && 'Status'}
                </span>
              </label>
            ))}
          </div>

          {/* Botões de Exportação */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={exportarExcel}
              style={{
                background: '#10B981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
              }}>
              📊 Exportar Excel
            </button>
            <button
              onClick={exportarPDF}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
              }}>
              📄 Exportar PDF
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Preview ({dados.length} registros)
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  {colunas.id && <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>}
                  {colunas.descricao && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Descrição</th>}
                  {colunas.tipo && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tipo</th>}
                  {colunas.centro && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Centro</th>}
                  {colunas.data_aquisicao && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Data</th>}
                  {colunas.valor && <th style={{ padding: '0.75rem', textAlign: 'right' }}>Valor</th>}
                  {colunas.status && <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>}
                </tr>
              </thead>
              <tbody>
                {dados.slice(0, 10).map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {colunas.id && <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: '600', color: 'var(--color-primary)' }}>{p.ID_PATRIMONIO}</td>}
                    {colunas.descricao && <td style={{ padding: '0.75rem' }}>{p.DESCRICAO}</td>}
                    {colunas.tipo && <td style={{ padding: '0.75rem' }}>{p.TIPO}</td>}
                    {colunas.centro && <td style={{ padding: '0.75rem' }}>{p.CENTRO_CUSTO}</td>}
                    {colunas.data_aquisicao && <td style={{ padding: '0.75rem' }}>{p.DATA_AQUISICAO}</td>}
                    {colunas.valor && <td style={{ padding: '0.75rem', textAlign: 'right' }}>R$ {p.VALOR.toFixed(2)}</td>}
                    {colunas.status && (
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
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dados.length > 10 && (
            <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Mostrando 10 de {dados.length} registros
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
