import { useParams } from "wouter";
import { usePatrimonioDetail } from "@/hooks/usePatrimonio";
import { Loader2 } from "lucide-react";

export default function VisualizacaoPage() {
  const { id } = useParams<{ id: string }>();
  const { patrimonio, historico, loading, error } = usePatrimonioDetail(id || "");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !patrimonio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Patrimônio não encontrado</h1>
          <p className="text-slate-600">{error || "ID inválido"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#990033] to-[#660022] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">PATRIMÔNIO</h1>
          <p className="text-[#D4AF37]">Hospital Regional de Ponta Porã</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Foto placeholder */}
          <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 text-lg">Foto do Patrimônio</span>
          </div>

          {/* Informações */}
          <div className="p-8">
            <div className="mb-6 pb-6 border-b-2 border-[#D4AF37]">
              <p className="text-sm text-slate-500 uppercase tracking-widest">ID</p>
              <p className="text-3xl font-bold text-[#990033] font-mono">{patrimonio.ID_PATRIMONIO}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Descrição</p>
                <p className="text-lg text-slate-900 font-semibold">{patrimonio.DESCRICAO}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Centro de Custo</p>
                  <p className="text-slate-900">{patrimonio.CENTRO_CUSTO}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Status</p>
                  <p className={`font-semibold ${patrimonio.STATUS === "ATIVO" ? "text-green-600" : "text-red-600"}`}>
                    {patrimonio.STATUS}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Localização</p>
                <p className="text-slate-900">{patrimonio.LOCALIZACAO}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Responsável</p>
                <p className="text-slate-900">{patrimonio.RESPONSAVEL}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-[#990033] to-[#CC6699] px-8 py-4 text-white text-center">
            <p className="text-sm">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
