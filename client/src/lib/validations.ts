// Validações de entrada
export const validacoes = {
  // Validar URL da API
  validarUrlApi: (url: string): boolean => {
    try {
      new URL(url);
      return url.includes('script.google.com') || url.includes('localhost');
    } catch {
      return false;
    }
  },

  // Validar ID do patrimônio
  validarId: (id: string): boolean => {
    return /^[A-Z]{3}\d{10}$/.test(id);
  },

  // Validar descrição
  validarDescricao: (desc: string): boolean => {
    return desc.length >= 3 && desc.length <= 200;
  },

  // Validar valor
  validarValor: (valor: any): boolean => {
    const num = parseFloat(valor);
    return !isNaN(num) && num >= 0;
  },

  // Validar data
  validarData: (data: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(data);
  },

  // Sanitizar entrada
  sanitizar: (entrada: string): string => {
    return entrada
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 500);
  },
};
