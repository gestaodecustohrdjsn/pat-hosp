import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import PatrimoniosPage from './pages/PatrimoniosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import VisualizacaoPage from './pages/VisualizacaoPage';
import EtiquetasPage from './pages/EtiquetasPage';
import ImportacaoPage from './pages/ImportacaoPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPatrimonio, setSelectedPatrimonio] = useState(null);

  const handleNavigate = (page: string, patrimonio?: any) => {
    setCurrentPage(page);
    if (patrimonio) setSelectedPatrimonio(patrimonio);
  };

  return (
    <div>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'patrimonios' && <PatrimoniosPage onNavigate={handleNavigate} />}
      {currentPage === 'configuracoes' && <ConfiguracoesPage onNavigate={handleNavigate} />}
      {currentPage === 'visualizacao' && <VisualizacaoPage patrimonio={selectedPatrimonio} onNavigate={handleNavigate} />}
      {currentPage === 'etiquetas' && <EtiquetasPage onNavigate={handleNavigate} />}
      {currentPage === 'importacao' && <ImportacaoPage onNavigate={handleNavigate} />}
    </div>
  );
}
