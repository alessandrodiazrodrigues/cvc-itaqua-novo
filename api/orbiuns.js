// ================================================================================
// 🏆 CVC ITAQUA - API PROXY DEFINITIVA PARA ORBIUNS
// ================================================================================
// Conecta direto com Google Sheets sem passar pelo Apps Script
// Resolve CORS definitivamente!
// ================================================================================

import { google } from 'googleapis';

// ================================================================================
// 🔧 CONFIGURAÇÃO
// ================================================================================
const SPREADSHEET_ID = '1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc'; // ID da sua planilha
const SHEET_NAME = 'Dados'; // Nome da aba

// Configurar autenticação
let auth;
try {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!credentialsJson) {
    throw new Error('GOOGLE_CREDENTIALS_JSON não configurado');
  }
  
  const credentials = JSON.parse(credentialsJson);
  
  auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} catch (error) {
  console.error('❌ Erro na configuração do Google Auth:', error);
}

const sheets = google.sheets({ version: 'v4', auth });

// ================================================================================
// 🌐 HANDLER PRINCIPAL COM CORS
// ================================================================================
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log(`[ORBIUNS API] ${req.method} request received`);
  
  try {
    if (req.method === 'GET') {
      return await handleGet(req, res);
    } else if (req.method === 'POST') {
      return await handlePost(req, res);
    } else {
      return res.status(405).json({
        success: false,
        message: `Método ${req.method} não suportado`
      });
    }
  } catch (error) {
    console.error('[ORBIUNS API] Erro:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// ================================================================================
// 📋 GET - LISTAR ORBIUNS E ESTATÍSTICAS
// ================================================================================
async function handleGet(req, res) {
  const { action } = req.query;
  
  switch (action) {
    case 'listar':
    case 'list':
      return await listarOrbiuns(res);
    case 'estatisticas':
    case 'stats':
      return await obterEstatisticas(res);
    default:
      return await getStatus(res);
  }
}

async function getStatus(res) {
  return res.status(200).json({
    success: true,
    message: "CVC Itaqua - API Orbiuns Proxy v1.0",
    timestamp: new Date().toISOString(),
    status: "Conectado diretamente com Google Sheets",
    cors: "CORS resolvido definitivamente ✅",
    spreadsheet: SPREADSHEET_ID,
    sheet: SHEET_NAME
  });
}

async function listarOrbiuns(res) {
  try {
    console.log('[ORBIUNS] Listando orbiuns da planilha...');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:N`, // Colunas A até N
    });
    
    const rows = response.data.values;
    
    if (!rows || rows.length <= 1) {
      return res.status(200).json({
        success: true,
        data: { orbiuns: [], total: 0 },
        message: 'Nenhum orbium encontrado'
      });
    }
    
    const orbiuns = [];
    
    // Processar linhas (pular cabeçalho)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      const orbium = {
        id: (i + 1).toString(),
        status: row[0] || '',
        orbium: row[1] || '',
        data_abertura: formatarData(row[2]),
        departamento: row[3] || '',
        vendedor: row[4] || '',
        recibo: row[5] || '',
        reserva: row[6] || '',
        pedido: row[7] || '',
        cia: row[8] || '',
        loc_gds: row[9] || '',
        loc_cia: row[10] || '',
        observacoes: row[11] || '',
        nome_cliente: row[12] || '',
        whats_cliente: row[13] || ''
      };
      
      orbiuns.push(orbium);
    }
    
    console.log(`[ORBIUNS] ${orbiuns.length} orbiuns carregados`);
    
    return res.status(200).json({
      success: true,
      data: { orbiuns, total: orbiuns.length },
      message: `${orbiuns.length} orbiuns carregados da aba "${SHEET_NAME}"`
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro ao listar:', error);
    throw new Error(`Erro ao listar orbiuns: ${error.message}`);
  }
}

async function obterEstatisticas(res) {
  try {
    console.log('[ORBIUNS] Calculando estatísticas...');
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`, // Apenas coluna de status
    });
    
    const rows = response.data.values;
    
    if (!rows || rows.length <= 1) {
      return res.status(200).json({
        success: true,
        data: {
          total: 0,
          em_atendimento: 0,
          resolvidos: 0,
          problema: 0,
          resolvidos_hoje: 0,
          resolvidos_30_dias: 0
        }
      });
    }
    
    let stats = {
      total: rows.length - 1,
      em_atendimento: 0,
      resolvidos: 0,
      problema: 0,
      resolvidos_hoje: 0,
      resolvidos_30_dias: 0
    };
    
    // Processar status (pular cabeçalho)
    for (let i = 1; i < rows.length; i++) {
      const status = (rows[i][0] || '').toString().toLowerCase();
      
      if (status.includes('atendimento')) {
        stats.em_atendimento++;
      } else if (status.includes('resolvido')) {
        stats.resolvidos++;
      } else if (status.includes('problema')) {
        stats.problema++;
      }
    }
    
    console.log('[ORBIUNS] Estatísticas calculadas:', stats);
    
    return res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro nas estatísticas:', error);
    throw new Error(`Erro ao calcular estatísticas: ${error.message}`);
  }
}

// ================================================================================
// 📝 POST - AÇÕES DE MODIFICAÇÃO
// ================================================================================
async function handlePost(req, res) {
  const { action } = req.body;
  
  console.log(`[ORBIUNS] Ação POST: ${action}`);
  
  switch (action) {
    case 'listar':
      return await listarOrbiuns(res);
    case 'estatisticas':
      return await obterEstatisticas(res);
    case 'cadastrar':
      return await cadastrarOrbium(req, res);
    case 'atualizar_status':
      return await atualizarStatus(req, res);
    case 'editar':
      return await editarOrbium(req, res);
    case 'deletar':
      return await deletarOrbium(req, res);
    default:
      return res.status(400).json({
        success: false,
        message: `Ação não reconhecida: ${action}`
      });
  }
}

async function cadastrarOrbium(req, res) {
  try {
    const { orbium: dadosOrbium } = req.body;
    
    if (!dadosOrbium || !dadosOrbium.orbium || !dadosOrbium.vendedor || !dadosOrbium.nome_cliente) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: orbium, vendedor, nome_cliente'
      });
    }
    
    console.log('[ORBIUNS] Cadastrando novo orbium:', dadosOrbium.orbium);
    
    const novaLinha = [
      dadosOrbium.status || 'Em atendimento',
      dadosOrbium.orbium,
      dadosOrbium.data_abertura || new Date().toLocaleDateString('pt-BR'),
      dadosOrbium.departamento || '',
      dadosOrbium.vendedor,
      dadosOrbium.recibo || '',
      dadosOrbium.reserva || '',
      dadosOrbium.pedido || '',
      dadosOrbium.cia || '',
      dadosOrbium.loc_gds || '',
      dadosOrbium.loc_cia || '',
      dadosOrbium.observacoes || '',
      dadosOrbium.nome_cliente,
      dadosOrbium.whats_cliente || ''
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [novaLinha]
      }
    });
    
    console.log('[ORBIUNS] Orbium cadastrado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: `Orbium ${dadosOrbium.orbium} cadastrado com sucesso!`,
      data: { orbium: dadosOrbium.orbium }
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro ao cadastrar:', error);
    throw new Error(`Erro ao cadastrar orbium: ${error.message}`);
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id, status, observacoes } = req.body;
    
    const linha = parseInt(id);
    if (isNaN(linha) || linha < 2) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
    
    console.log(`[ORBIUNS] Atualizando status linha ${linha} para: ${status}`);
    
    // Atualizar status (coluna A)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${linha}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[status]]
      }
    });
    
    // Adicionar observações se fornecidas (coluna L)
    if (observacoes) {
      // Primeiro pegar observações atuais
      const obsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!L${linha}`,
      });
      
      const obsAtual = obsResponse.data.values?.[0]?.[0] || '';
      const timestamp = new Date().toLocaleString('pt-BR');
      const novasObs = obsAtual + (obsAtual ? '\n' : '') + `[${timestamp}] ${observacoes}`;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!L${linha}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[novasObs]]
        }
      });
    }
    
    console.log('[ORBIUNS] Status atualizado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: `Status atualizado para: ${status}`,
      data: { status_novo: status }
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro ao atualizar status:', error);
    throw new Error(`Erro ao atualizar status: ${error.message}`);
  }
}

async function editarOrbium(req, res) {
  try {
    const { id, dados } = req.body;
    
    const linha = parseInt(id);
    if (isNaN(linha) || linha < 2) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
    
    console.log(`[ORBIUNS] Editando orbium linha ${linha}`);
    
    // Atualizar status se fornecido (coluna A)
    if (dados.status) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${linha}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[dados.status]]
        }
      });
    }
    
    // Atualizar observações se fornecidas (coluna L)
    if (dados.observacoes !== undefined) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!L${linha}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[dados.observacoes]]
        }
      });
    }
    
    console.log('[ORBIUNS] Orbium editado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: 'Orbium editado com sucesso!',
      data: { id }
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro ao editar:', error);
    throw new Error(`Erro ao editar orbium: ${error.message}`);
  }
}

async function deletarOrbium(req, res) {
  try {
    const { id } = req.body;
    
    const linha = parseInt(id);
    if (isNaN(linha) || linha < 2) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
    
    console.log(`[ORBIUNS] Deletando orbium linha ${linha}`);
    
    // Google Sheets API não tem delete row direto, então vamos limpar a linha
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${linha}:N${linha}`,
    });
    
    console.log('[ORBIUNS] Orbium deletado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: 'Orbium deletado!',
      data: { id_deletado: id }
    });
    
  } catch (error) {
    console.error('[ORBIUNS] Erro ao deletar:', error);
    throw new Error(`Erro ao deletar orbium: ${error.message}`);
  }
}

// ================================================================================
// 🛠️ FUNÇÕES AUXILIARES
// ================================================================================
function formatarData(data) {
  if (!data) return '';
  
  try {
    if (data instanceof Date) {
      return data.toLocaleDateString('pt-BR');
    }
    
    if (typeof data === 'string') {
      // Se já está no formato brasileiro, manter
      if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return data;
      }
      
      const dataObj = new Date(data);
      if (!isNaN(dataObj.getTime())) {
        return dataObj.toLocaleDateString('pt-BR');
      }
    }
    
    return data.toString();
  } catch (error) {
    return data ? data.toString() : '';
  }
}
