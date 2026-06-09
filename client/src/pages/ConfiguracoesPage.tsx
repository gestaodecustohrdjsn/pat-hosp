import { useState } from "react";
import { getApiUrl, setApiUrl, testConnection } from "@/lib/api";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [apiUrl, setLocalUrl] = useState(getApiUrl() || "");
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!apiUrl) {
      toast.error("Digite a URL da API");
      return;
    }

    setTesting(true);
    try {
      const success = await testConnection(apiUrl);
      if (success) {
        setApiUrl(apiUrl);
        toast.success("Conexão estabelecida com sucesso!");
      } else {
        toast.error("Falha na conexão com a API");
      }
    } catch (error) {
      toast.error("Erro ao testar conexão");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Configurações</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">API Google Apps Script</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL da API
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleTest}
            disabled={testing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-semibold"
          >
            {testing ? "Testando..." : "Testar Conexão"}
          </button>

          {getApiUrl() && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">✓ API configurada com sucesso</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
