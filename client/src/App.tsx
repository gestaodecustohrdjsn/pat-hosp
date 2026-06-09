import { useState } from 'react';
import HomePage from './pages/HomePage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import PatrimoniosPage from './pages/PatrimoniosPage';
import VisualizacaoPage from './pages/VisualizacaoPage';
import EtiquetasPage from './pages/EtiquetasPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [patrimonio, setPatrimonio] = useState<any>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'configuracoes':
        return <ConfiguracoesPage onNavigate={setCurrentPage} />;
      case 'patrimonios':
        return <PatrimoniosPage onNavigate={setCurrentPage} />;
      case 'visualizacao':
        return <VisualizacaoPage patrimonio={patrimonio} onNavigate={setCurrentPage} />;
      case 'etiquetas':
        return <EtiquetasPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {renderPage()}
    </div>
  );
}
