export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">PAT.HOSP</h1>
        <p className="text-xl text-slate-600 mb-8">Sistema de Controle de Patrimônio Hospitalar</p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/etiquetas" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
            🏷️ Etiquetas
          </a>
          <a href="/configuracoes" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            ⚙️ Configurações
          </a>
        </div>
        
        <p className="text-sm text-slate-500 mt-8">
          Hospital Regional de Ponta Porã
        </p>
      </div>
    </div>
  );
}
