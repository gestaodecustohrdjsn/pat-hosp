import { useState, useEffect } from "react";
import { Patrimonio, HistoricoMovimentacao, listarPatrimonios, obterPatrimonio, obterHistorico } from "@/lib/api";

export const usePatrimonioList = () => {
  const [patrimonio, setPatrimonio] = useState<Patrimonio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatrimonio = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarPatrimonios();
      setPatrimonio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar patrimônios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrimonio();
  }, []);

  return { patrimonio, loading, error, refetch: fetchPatrimonio };
};

export const usePatrimonioDetail = (id: string) => {
  const [patrimonio, setPatrimonio] = useState<Patrimonio | null>(null);
  const [historico, setHistorico] = useState<HistoricoMovimentacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pat, hist] = await Promise.all([
          obterPatrimonio(id),
          obterHistorico(id),
        ]);
        setPatrimonio(pat);
        setHistorico(hist);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { patrimonio, historico, loading, error };
};
