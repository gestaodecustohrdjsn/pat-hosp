// PAT.HOSP - Google Apps Script Backend
// Sistema de Controle de Patrimônio Hospitalar

const SHEET_NAME_PATRIMONIO = "Patrimonio";
const SHEET_NAME_HISTORICO = "Historico";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case "test":
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);

      case "listar":
        return listarPatrimonios();

      case "obter":
        return obterPatrimonio(data.id);

      case "adicionar":
        return adicionarPatrimonio(data.patrimonio);

      case "editar":
        return editarPatrimonio(data.id, data.patrimonio);

      case "movimentar":
        return movimentarPatrimonio(data.id, data.centroCusto, data.motivo);

      case "historico":
        return obterHistorico(data.id);

      default:
        return ContentService.createTextOutput(JSON.stringify({ error: "Ação não reconhecida" }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function inicializarPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Criar aba Patrimonio se não existir
  if (!ss.getSheetByName(SHEET_NAME_PATRIMONIO)) {
    const sheet = ss.insertSheet(SHEET_NAME_PATRIMONIO);
    sheet.appendRow([
      "ID_PATRIMONIO",
      "DESCRICAO",
      "CENTRO_CUSTO",
      "SIGEM",
      "STATUS",
      "DATA_AQUISICAO",
      "VALOR",
      "LOCALIZACAO",
      "RESPONSAVEL",
      "DATA_CRIACAO",
    ]);
  }

  // Criar aba Historico se não existir
  if (!ss.getSheetByName(SHEET_NAME_HISTORICO)) {
    const sheet = ss.insertSheet(SHEET_NAME_HISTORICO);
    sheet.appendRow([
      "ID_PATRIMONIO",
      "DATA",
      "TIPO",
      "CENTRO_ORIGEM",
      "CENTRO_DESTINO",
      "DESCRICAO",
      "USUARIO",
    ]);
  }
}

function gerarIDPatrimonio() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);
  const rows = sheet.getDataRange().getValues();
  const lastRow = rows.length;

  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = String(hoje.getFullYear()).slice(-2);
  const numero = String(lastRow).padStart(4, "0");

  return `PAT${mes}${ano}${numero}`;
}

function listarPatrimonios() {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);
  const data = sheet.getDataRange().getValues();

  const patrimonio = [];
  for (let i = 1; i < data.length; i++) {
    patrimonio.push({
      ID_PATRIMONIO: data[i][0],
      DESCRICAO: data[i][1],
      CENTRO_CUSTO: data[i][2],
      SIGEM: data[i][3],
      STATUS: data[i][4],
      DATA_AQUISICAO: data[i][5],
      VALOR: data[i][6],
      LOCALIZACAO: data[i][7],
      RESPONSAVEL: data[i][8],
    });
  }

  return ContentService.createTextOutput(JSON.stringify(patrimonio))
    .setMimeType(ContentService.MimeType.JSON);
}

function obterPatrimonio(id) {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return ContentService.createTextOutput(
        JSON.stringify({
          ID_PATRIMONIO: data[i][0],
          DESCRICAO: data[i][1],
          CENTRO_CUSTO: data[i][2],
          SIGEM: data[i][3],
          STATUS: data[i][4],
          DATA_AQUISICAO: data[i][5],
          VALOR: data[i][6],
          LOCALIZACAO: data[i][7],
          RESPONSAVEL: data[i][8],
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify(null))
    .setMimeType(ContentService.MimeType.JSON);
}

function adicionarPatrimonio(patrimonio) {
  inicializarPlanilha();
  const id = gerarIDPatrimonio();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);

  sheet.appendRow([
    id,
    patrimonio.DESCRICAO,
    patrimonio.CENTRO_CUSTO,
    patrimonio.SIGEM || "",
    patrimonio.STATUS || "ATIVO",
    patrimonio.DATA_AQUISICAO || new Date().toISOString().split("T")[0],
    patrimonio.VALOR || 0,
    patrimonio.LOCALIZACAO || "",
    patrimonio.RESPONSAVEL || "",
    new Date().toISOString(),
  ]);

  // Registrar no histórico
  registrarHistorico(id, "CADASTRO", "", patrimonio.CENTRO_CUSTO, `Patrimônio cadastrado: ${patrimonio.DESCRICAO}`);

  return ContentService.createTextOutput(JSON.stringify({ id, success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function editarPatrimonio(id, patrimonio) {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      if (patrimonio.DESCRICAO) sheet.getRange(i + 1, 2).setValue(patrimonio.DESCRICAO);
      if (patrimonio.CENTRO_CUSTO) sheet.getRange(i + 1, 3).setValue(patrimonio.CENTRO_CUSTO);
      if (patrimonio.SIGEM) sheet.getRange(i + 1, 4).setValue(patrimonio.SIGEM);
      if (patrimonio.STATUS) sheet.getRange(i + 1, 5).setValue(patrimonio.STATUS);
      if (patrimonio.LOCALIZACAO) sheet.getRange(i + 1, 8).setValue(patrimonio.LOCALIZACAO);
      if (patrimonio.RESPONSAVEL) sheet.getRange(i + 1, 9).setValue(patrimonio.RESPONSAVEL);

      registrarHistorico(id, "ALTERACAO", "", patrimonio.CENTRO_CUSTO || data[i][2], "Patrimônio alterado");

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false }))
    .setMimeType(ContentService.MimeType.JSON);
}

function movimentarPatrimonio(id, centroCusto, motivo) {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_PATRIMONIO);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const centroAnterior = data[i][2];
      sheet.getRange(i + 1, 3).setValue(centroCusto);

      registrarHistorico(id, "MOVIMENTACAO", centroAnterior, centroCusto, motivo);

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: false }))
    .setMimeType(ContentService.MimeType.JSON);
}

function registrarHistorico(id, tipo, centroOrigem, centroDestino, descricao) {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_HISTORICO);

  sheet.appendRow([
    id,
    new Date().toISOString(),
    tipo,
    centroOrigem,
    centroDestino,
    descricao,
    Session.getActiveUser().getEmail(),
  ]);
}

function obterHistorico(id) {
  inicializarPlanilha();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_HISTORICO);
  const data = sheet.getDataRange().getValues();

  const historico = [];
  for (let i = 1; i < data.length; i++) {
    if (!id || data[i][0] === id) {
      historico.push({
        ID_PATRIMONIO: data[i][0],
        DATA: data[i][1],
        TIPO: data[i][2],
        CENTRO_ORIGEM: data[i][3],
        CENTRO_DESTINO: data[i][4],
        DESCRICAO: data[i][5],
        USUARIO: data[i][6],
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(historico))
    .setMimeType(ContentService.MimeType.JSON);
}
