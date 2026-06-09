// PAT.HOSP - Sistema de Gestão de Patrimônio Hospitalar
// Google Apps Script Backend v2.0 - Completo com ID Generation e Todas as Operações

const SHEET_PATRIMONIO = "Patrimonio";
const SHEET_HISTORICO = "Historico";
const SHEET_MOVIMENTACOES = "Movimentacoes";
const SHEET_INATIVOS = "Inativos";
const SHEET_CONTADORES = "Contadores";

// ============================================
// INICIALIZAÇÃO E SETUP
// ============================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'test':
        return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'listar':
        return ContentService.createTextOutput(JSON.stringify(listarPatrimonios()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'obter':
        return ContentService.createTextOutput(JSON.stringify(obterPatrimonio(data.id)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'adicionar':
        return ContentService.createTextOutput(JSON.stringify(adicionarPatrimonio(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'editar':
        return ContentService.createTextOutput(JSON.stringify(editarPatrimonio(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'remover':
        return ContentService.createTextOutput(JSON.stringify(removerPatrimonio(data.id)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'ativar':
        return ContentService.createTextOutput(JSON.stringify(ativarPatrimonio(data.id)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'inativar':
        return ContentService.createTextOutput(JSON.stringify(inativarPatrimonio(data.id)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'movimentar':
        return ContentService.createTextOutput(JSON.stringify(movimentarPatrimonio(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'listarMovimentacoes':
        return ContentService.createTextOutput(JSON.stringify(listarMovimentacoes(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'importar':
        return ContentService.createTextOutput(JSON.stringify(importarPatrimonios(data.patrimonios)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'gerarRelatorio':
        return ContentService.createTextOutput(JSON.stringify(gerarRelatorio(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'listarInativos':
        return ContentService.createTextOutput(JSON.stringify(listarInativos()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'estatisticas':
        return ContentService.createTextOutput(JSON.stringify(obterEstatisticas()))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService.createTextOutput(JSON.stringify({ error: 'Ação não encontrada' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GERADOR DE IDs AUTOMÁTICO
// ============================================

function gerarNovoID(tipo = 'GER', centroCusto = '0001') {
  const sheet = obterOuCriarSheet(SHEET_CONTADORES);
  const dados = sheet.getDataRange().getValues();
  
  let contador = 1;
  let linha = -1;
  
  // Procura linha existente para este tipo/centro
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === tipo && dados[i][1] === centroCusto) {
      contador = parseInt(dados[i][2]) + 1;
      linha = i + 1;
      break;
    }
  }
  
  // Se não encontrou, cria nova linha
  if (linha === -1) {
    linha = dados.length + 1;
  }
  
  // Atualiza contador
  sheet.getRange(linha, 1).setValue(tipo);
  sheet.getRange(linha, 2).setValue(centroCusto);
  sheet.getRange(linha, 3).setValue(contador);
  
  // Formata ID: {TIPO}{CENTRO}{MES}{ANO}{NUMERO}
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  const ano = String(new Date().getFullYear()).slice(-2);
  const num = String(contador).padStart(4, '0');
  
  return `${tipo}${centroCusto}${mes}${ano}${num}`;
}

// ============================================
// GERENCIAMENTO DE SHEETS
// ============================================

function obterOuCriarSheet(nomePlanilha) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(nomePlanilha);
  
  if (!sheet) {
    sheet = ss.insertSheet(nomePlanilha);
    
    // Adiciona headers baseado no tipo de sheet
    if (nomePlanilha === SHEET_PATRIMONIO) {
      sheet.appendRow([
        'ID_PATRIMONIO', 'DESCRICAO', 'TIPO', 'CENTRO_CUSTO', 'DATA_AQUISICAO',
        'VALOR', 'STATUS', 'DATA_CADASTRO', 'OBSERVACOES'
      ]);
    } else if (nomePlanilha === SHEET_HISTORICO) {
      sheet.appendRow([
        'ID_PATRIMONIO', 'ACAO', 'DESCRICAO', 'DATA_HORA', 'USUARIO'
      ]);
    } else if (nomePlanilha === SHEET_MOVIMENTACOES) {
      sheet.appendRow([
        'ID_PATRIMONIO', 'CENTRO_ORIGEM', 'CENTRO_DESTINO', 'DATA_MOVIMENTACAO', 'MOTIVO'
      ]);
    } else if (nomePlanilha === SHEET_INATIVOS) {
      sheet.appendRow([
        'ID_PATRIMONIO', 'DESCRICAO', 'TIPO', 'CENTRO_CUSTO', 'DATA_INATIVACAO', 'MOTIVO'
      ]);
    } else if (nomePlanilha === SHEET_CONTADORES) {
      sheet.appendRow(['TIPO', 'CENTRO_CUSTO', 'CONTADOR']);
    }
  }
  
  return sheet;
}

// ============================================
// OPERAÇÕES DE PATRIMÔNIO
// ============================================

function listarPatrimonios() {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const dados = sheet.getDataRange().getValues();
  const resultado = [];
  
  for (let i = 1; i < dados.length; i++) {
    resultado.push({
      ID_PATRIMONIO: dados[i][0],
      DESCRICAO: dados[i][1],
      TIPO: dados[i][2],
      CENTRO_CUSTO: dados[i][3],
      DATA_AQUISICAO: dados[i][4],
      VALOR: dados[i][5],
      STATUS: dados[i][6],
      DATA_CADASTRO: dados[i][7],
      OBSERVACOES: dados[i][8]
    });
  }
  
  return resultado;
}

function obterPatrimonio(id) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const dados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] === id) {
      return {
        ID_PATRIMONIO: dados[i][0],
        DESCRICAO: dados[i][1],
        TIPO: dados[i][2],
        CENTRO_CUSTO: dados[i][3],
        DATA_AQUISICAO: dados[i][4],
        VALOR: dados[i][5],
        STATUS: dados[i][6],
        DATA_CADASTRO: dados[i][7],
        OBSERVACOES: dados[i][8]
      };
    }
  }
  
  return null;
}

function adicionarPatrimonio(dados) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  
  // Gera novo ID
  const tipo = (dados.tipo || 'GER').substring(0, 3).toUpperCase();
  const centro = (dados.centro_custo || '0001').substring(0, 4);
  const novoID = gerarNovoID(tipo, centro);
  
  // Adiciona à planilha
  sheet.appendRow([
    novoID,
    dados.descricao || '',
    tipo,
    centro,
    dados.data_aquisicao || new Date().toLocaleDateString('pt-BR'),
    dados.valor || 0,
    'ATIVO',
    new Date().toLocaleString('pt-BR'),
    dados.observacoes || ''
  ]);
  
  // Registra no histórico
  registrarHistorico(novoID, 'CADASTRO', `Patrimônio cadastrado: ${dados.descricao}`);
  
  return { success: true, id: novoID, message: 'Patrimônio adicionado com sucesso' };
}

function editarPatrimonio(dados) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const sheetDados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < sheetDados.length; i++) {
    if (sheetDados[i][0] === dados.id) {
      if (dados.descricao) sheet.getRange(i + 1, 2).setValue(dados.descricao);
      if (dados.tipo) sheet.getRange(i + 1, 3).setValue(dados.tipo);
      if (dados.data_aquisicao) sheet.getRange(i + 1, 5).setValue(dados.data_aquisicao);
      if (dados.valor !== undefined) sheet.getRange(i + 1, 6).setValue(dados.valor);
      if (dados.observacoes) sheet.getRange(i + 1, 9).setValue(dados.observacoes);
      
      registrarHistorico(dados.id, 'ALTERACAO', 'Patrimônio alterado');
      
      return { success: true, message: 'Patrimônio editado com sucesso' };
    }
  }
  
  return { success: false, error: 'Patrimônio não encontrado' };
}

function removerPatrimonio(id) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const sheetDados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < sheetDados.length; i++) {
    if (sheetDados[i][0] === id) {
      sheet.deleteRow(i + 1);
      registrarHistorico(id, 'EXCLUSAO', 'Patrimônio removido');
      return { success: true, message: 'Patrimônio removido com sucesso' };
    }
  }
  
  return { success: false, error: 'Patrimônio não encontrado' };
}

function ativarPatrimonio(id) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const sheetDados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < sheetDados.length; i++) {
    if (sheetDados[i][0] === id) {
      sheet.getRange(i + 1, 7).setValue('ATIVO');
      registrarHistorico(id, 'ATIVACAO', 'Patrimônio ativado');
      return { success: true, message: 'Patrimônio ativado com sucesso' };
    }
  }
  
  return { success: false, error: 'Patrimônio não encontrado' };
}

function inativarPatrimonio(id) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const sheetDados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < sheetDados.length; i++) {
    if (sheetDados[i][0] === id) {
      const patrimonio = sheetDados[i];
      
      // Move para inativos
      const sheetInativos = obterOuCriarSheet(SHEET_INATIVOS);
      sheetInativos.appendRow([
        patrimonio[0],
        patrimonio[1],
        patrimonio[2],
        patrimonio[3],
        new Date().toLocaleString('pt-BR'),
        'Inativado pelo sistema'
      ]);
      
      // Remove do ativo
      sheet.deleteRow(i + 1);
      registrarHistorico(id, 'INATIVACAO', 'Patrimônio inativado');
      
      return { success: true, message: 'Patrimônio inativado com sucesso' };
    }
  }
  
  return { success: false, error: 'Patrimônio não encontrado' };
}

// ============================================
// MOVIMENTAÇÕES
// ============================================

function movimentarPatrimonio(dados) {
  const sheet = obterOuCriarSheet(SHEET_PATRIMONIO);
  const sheetDados = sheet.getDataRange().getValues();
  
  for (let i = 1; i < sheetDados.length; i++) {
    if (sheetDados[i][0] === dados.id) {
      const centroOrigem = sheetDados[i][3];
      
      // Atualiza centro de custo
      sheet.getRange(i + 1, 4).setValue(dados.centro_destino);
      
      // Registra movimentação
      const sheetMov = obterOuCriarSheet(SHEET_MOVIMENTACOES);
      sheetMov.appendRow([
        dados.id,
        centroOrigem,
        dados.centro_destino,
        new Date().toLocaleString('pt-BR'),
        dados.motivo || 'Movimentação'
      ]);
      
      registrarHistorico(dados.id, 'MOVIMENTACAO', `Movido de ${centroOrigem} para ${dados.centro_destino}`);
      
      return { success: true, message: 'Patrimônio movimentado com sucesso' };
    }
  }
  
  return { success: false, error: 'Patrimônio não encontrado' };
}

function listarMovimentacoes(filtros = {}) {
  const sheet = obterOuCriarSheet(SHEET_MOVIMENTACOES);
  const dados = sheet.getDataRange().getValues();
  const resultado = [];
  
  for (let i = 1; i < dados.length; i++) {
    const mov = {
      ID_PATRIMONIO: dados[i][0],
      CENTRO_ORIGEM: dados[i][1],
      CENTRO_DESTINO: dados[i][2],
      DATA_MOVIMENTACAO: dados[i][3],
      MOTIVO: dados[i][4]
    };
    
    // Aplica filtros
    if (filtros.id && mov.ID_PATRIMONIO !== filtros.id) continue;
    if (filtros.centro && mov.CENTRO_ORIGEM !== filtros.centro && mov.CENTRO_DESTINO !== filtros.centro) continue;
    
    resultado.push(mov);
  }
  
  return resultado;
}

// ============================================
// HISTÓRICO
// ============================================

function registrarHistorico(id, acao, descricao) {
  const sheet = obterOuCriarSheet(SHEET_HISTORICO);
  sheet.appendRow([
    id,
    acao,
    descricao,
    new Date().toLocaleString('pt-BR'),
    Session.getActiveUser().getEmail()
  ]);
}

// ============================================
// IMPORTAÇÃO
// ============================================

function importarPatrimonios(patrimonios) {
  const resultados = [];
  
  for (let i = 0; i < patrimonios.length; i++) {
    const p = patrimonios[i];
    const resultado = adicionarPatrimonio({
      descricao: p.descricao,
      tipo: p.tipo || 'GER',
      centro_custo: p.centro_custo || '0001',
      data_aquisicao: p.data_aquisicao,
      valor: p.valor || 0,
      observacoes: p.observacoes || ''
    });
    
    resultados.push(resultado);
  }
  
  return { success: true, total: resultados.length, resultados: resultados };
}

// ============================================
// RELATÓRIOS E ESTATÍSTICAS
// ============================================

function gerarRelatorio(filtros = {}) {
  const patrimonios = listarPatrimonios();
  let resultado = patrimonios;
  
  // Aplica filtros
  if (filtros.centro_custo) {
    resultado = resultado.filter(p => p.CENTRO_CUSTO === filtros.centro_custo);
  }
  if (filtros.status) {
    resultado = resultado.filter(p => p.STATUS === filtros.status);
  }
  if (filtros.tipo) {
    resultado = resultado.filter(p => p.TIPO === filtros.tipo);
  }
  
  // Calcula estatísticas
  const stats = {
    total: resultado.length,
    por_tipo: {},
    por_centro: {},
    por_status: {}
  };
  
  resultado.forEach(p => {
    stats.por_tipo[p.TIPO] = (stats.por_tipo[p.TIPO] || 0) + 1;
    stats.por_centro[p.CENTRO_CUSTO] = (stats.por_centro[p.CENTRO_CUSTO] || 0) + 1;
    stats.por_status[p.STATUS] = (stats.por_status[p.STATUS] || 0) + 1;
  });
  
  return { dados: resultado, estatisticas: stats };
}

function obterEstatisticas() {
  const patrimonios = listarPatrimonios();
  const stats = {
    total: patrimonios.length,
    ativos: patrimonios.filter(p => p.STATUS === 'ATIVO').length,
    inativos: listarInativos().length,
    por_tipo: {},
    por_centro: {}
  };
  
  patrimonios.forEach(p => {
    stats.por_tipo[p.TIPO] = (stats.por_tipo[p.TIPO] || 0) + 1;
    stats.por_centro[p.CENTRO_CUSTO] = (stats.por_centro[p.CENTRO_CUSTO] || 0) + 1;
  });
  
  return stats;
}

// ============================================
// INATIVOS
// ============================================

function listarInativos() {
  const sheet = obterOuCriarSheet(SHEET_INATIVOS);
  const dados = sheet.getDataRange().getValues();
  const resultado = [];
  
  for (let i = 1; i < dados.length; i++) {
    resultado.push({
      ID_PATRIMONIO: dados[i][0],
      DESCRICAO: dados[i][1],
      TIPO: dados[i][2],
      CENTRO_CUSTO: dados[i][3],
      DATA_INATIVACAO: dados[i][4],
      MOTIVO: dados[i][5]
    });
  }
  
  return resultado;
}
