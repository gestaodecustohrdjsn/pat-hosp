import axios from "axios";

const API_URL_KEY = "pat_hosp_api_url";

export interface Patrimonio {
  ID_PATRIMONIO: string;
  DESCRICAO: string;
  CENTRO_CUSTO: string;
  SIGEM: string;
  STATUS: "ATIVO" | "INATIVO" | "DESCARTADO";
  DATA_AQUISICAO: string;
  VALOR: number;
  LOCALIZACAO: string;
  RESPONSAVEL: string;
}

export interface HistoricoMovimentacao {
  ID_PATRIMONIO: string;
  DATA: string;
  TIPO: "CADASTRO" | "MOVIMENTACAO" | "STATUS" | "USO" | "ALTERACAO" | "EXCLUSAO";
  CENTRO_ORIGEM: string;
  CENTRO_DESTINO: string;
  DESCRICAO: string;
  USUARIO: string;
}

export const getApiUrl = (): string | null => {
  return localStorage.getItem(API_URL_KEY);
};

export const setApiUrl = (url: string): void => {
  localStorage.setItem(API_URL_KEY, url);
};

export const testConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.post(url, {
      action: "test",
    });
    return response.status === 200;
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return false;
  }
};

export const listarPatrimonios = async (): Promise<Patrimonio[]> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "listar",
  });

  return response.data || [];
};

export const obterPatrimonio = async (id: string): Promise<Patrimonio | null> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "obter",
    id,
  });

  return response.data || null;
};

export const adicionarPatrimonio = async (patrimonio: Omit<Patrimonio, "ID_PATRIMONIO">): Promise<string> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "adicionar",
    patrimonio,
  });

  return response.data?.id || "";
};

export const editarPatrimonio = async (id: string, patrimonio: Partial<Patrimonio>): Promise<boolean> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "editar",
    id,
    patrimonio,
  });

  return response.data?.success || false;
};

export const movimentarPatrimonio = async (id: string, centroCusto: string, motivo: string): Promise<boolean> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "movimentar",
    id,
    centroCusto,
    motivo,
  });

  return response.data?.success || false;
};

export const obterHistorico = async (id?: string): Promise<HistoricoMovimentacao[]> => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL não configurada");

  const response = await axios.post(url, {
    action: "historico",
    id,
  });

  return response.data || [];
};
