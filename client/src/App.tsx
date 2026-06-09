import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import PatrimoniosPage from './pages/PatrimoniosPage';
import ImportacaoPage from './pages/ImportacaoPage';
import RelatoriosPage from './pages/RelatoriosPage';
import EtiquetasPage from './pages/EtiquetasPage';
import VisualizacaoPage from './pages/VisualizacaoPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [patrimonio_id, setPatrimonio_id] = useState<string | undefined>();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'configuracoes':
        return <ConfiguracoesPage onNavigate={setCurrentPage} />;
      case 'patrimonios':
        return <PatrimoniosPage onNavigate={setCurrentPage} />;
      case 'importacao':
        return <ImportacaoPage onNavigate={setCurrentPage} />;
      case 'relatorios':
        return <RelatoriosPage onNavigate={setCurrentPage} />;
      case 'etiquetas':
        return <EtiquetasPage onNavigate={setCurrentPage} />;
      case 'visualizacao':
        return <VisualizacaoPage patrimonio_id={patrimonio_id} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {renderPage()}
    </div>
  );
}
