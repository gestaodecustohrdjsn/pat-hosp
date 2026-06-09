import { useState, useRef } from "react";
import { usePatrimonioList } from "@/hooks/usePatrimonio";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

interface EtiquetaItem {
  id: string;
  descricao: string;
  qrCode: string;
}

export default function EtiquetasPage() {
  const { patrimonio, loading } = usePatrimonioList();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [etiquetas, setEtiquetas] = useState<EtiquetaItem[]>([]);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const filteredPatrimonio = patrimonio.filter(
    (p) =>
      p.ID_PATRIMONIO.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.DESCRICAO.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === filteredPatrimonio.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredPatrimonio.map((p) => p.ID_PATRIMONIO)));
    }
  };

  const generateEtiquetas = async () => {
    if (selected.size === 0) {
      toast.error("Selecione pelo menos um patrimônio");
      return;
    }

    setGeneratingQR(true);

    try {
      const newEtiquetas: EtiquetaItem[] = [];

      for (const id of Array.from(selected)) {
        const pat = patrimonio.find((p) => p.ID_PATRIMONIO === id);
        if (!pat) continue;

        const url = `${window.location.origin}/patrimonio/${id}`;
        const qrCode = await QRCode.toDataURL(url, {
          errorCorrectionLevel: "H",
          type: "image/png",
          quality: 0.95,
          margin: 1,
          width: 200,
        });

        newEtiquetas.push({
          id,
          descricao: pat.DESCRICAO,
          qrCode,
        });
      }

      setEtiquetas(newEtiquetas);
      toast.success(`${newEtiquetas.length} etiqueta(s) gerada(s)`);
    } catch (error) {
      toast.error("Erro ao gerar QR Codes");
    } finally {
      setGeneratingQR(false);
    }
  };

  const clearEtiquetas = () => {
    setEtiquetas([]);
    setSelected(new Set());
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Gerador de Etiquetas</h1>
          <p className="text-slate-600">Crie etiquetas com QR Code para seus patrimônios</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Seleção</h2>

              <input
                type="text"
                placeholder="Buscar patrimônio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={selectAll}
                className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                {selected.size === filteredPatrimonio.length && filteredPatrimonio.length > 0
                  ? "Desselecionar Todos"
                  : "Selecionar Todos"}
              </button>

              <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  </div>
                ) : filteredPatrimonio.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum patrimônio encontrado</p>
                ) : (
                  filteredPatrimonio.map((p) => (
                    <label key={p.ID_PATRIMONIO} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(p.ID_PATRIMONIO)}
                        onChange={() => toggleSelection(p.ID_PATRIMONIO)}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-slate-900 truncate">{p.ID_PATRIMONIO}</p>
                        <p className="text-xs text-slate-500 truncate">{p.DESCRICAO}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
                <p className="text-sm font-semibold text-blue-900">
                  {selected.size} selecionado{selected.size !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                onClick={generateEtiquetas}
                disabled={generatingQR || selected.size === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-semibold mb-2"
              >
                {generatingQR ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Gerar Etiquetas
                  </>
                )}
              </button>

              {etiquetas.length > 0 && (
                <button
                  onClick={clearEtiquetas}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {etiquetas.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhuma etiqueta gerada</h3>
                <p className="text-slate-600">Selecione patrimônios e clique em "Gerar Etiquetas"</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {etiquetas.length} etiqueta{etiquetas.length !== 1 ? "s" : ""} gerada{etiquetas.length !== 1 ? "s" : ""}
                  </h2>
                  <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    Imprimir
                  </button>
                </div>

                <div ref={printRef} className="space-y-0">
                  {etiquetas.map((etiqueta, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-300 p-0"
                      style={{
                        width: "200mm",
                        height: "100mm",
                        display: "flex",
                        pageBreakAfter: "always",
                      }}
                    >
                      <div style={{ width: "80mm", height: "100mm", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderRight: "1px solid #E5E7EB" }}>
                        <img src={etiqueta.qrCode} alt="QR Code" style={{ width: "70mm", height: "70mm", border: "5mm solid white" }} />
                      </div>

                      <div style={{ width: "120mm", height: "100mm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "10mm", backgroundColor: "#FFFFFF" }}>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: "10pt", fontWeight: "bold", color: "#000" }}>PATRIMÔNIO</p>
                          <p style={{ fontSize: "8pt", color: "#666", marginTop: "2mm" }}>Hospital Regional de Ponta Porã</p>
                        </div>

                        <div style={{ width: "100mm", height: "25mm", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "28pt", fontWeight: "bold", color: "#FFFFFF" }}>
                            {etiqueta.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .bg-gradient-to-br, .bg-white.border-b, button, input, label { display: none !important; }
          @page { size: 200mm 100mm; margin: 0; }
        }
      `}</style>
    </div>
  );
}
