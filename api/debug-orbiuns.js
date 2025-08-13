// ================================================================================
// 🧪 CVC ITAQUA - API DEBUG PARA ORBIUNS
// ================================================================================
// Esta API vai nos ajudar a entender exatamente o que está acontecendo
// ================================================================================

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // LOG COMPLETO DE TUDO QUE CHEGA
    console.log('=== DEBUG API ORBIUNS ===');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Body stringified:', JSON.stringify(req.body));
    
    // Verificar variáveis de ambiente
    console.log('=== ENVIRONMENT VARIABLES ===');
    console.log('GOOGLE_CREDENTIALS_JSON exists:', !!process.env.GOOGLE_CREDENTIALS_JSON);
    console.log('GOOGLE_CREDENTIALS_JSON length:', process.env.GOOGLE_CREDENTIALS_JSON?.length || 0);
    
    // Se for GET, retornar status
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: "Debug API funcionando",
        method: req.method,
        timestamp: new Date().toISOString(),
        environment: {
          has_google_credentials: !!process.env.GOOGLE_CREDENTIALS_JSON,
          credentials_length: process.env.GOOGLE_CREDENTIALS_JSON?.length || 0
        }
      });
    }
    
    // Se for POST, processar
    if (req.method === 'POST') {
      const { action } = req.body;
      
      console.log('=== PROCESSING POST ===');
      console.log('Action:', action);
      
      // Para listar, vamos tentar conectar com Google Sheets
      if (action === 'listar') {
        try {
          const result = await testarConexaoSheets();
          
          // Simular resposta no formato esperado pelo frontend
          if (result.success) {
            return res.status(200).json({
              success: true,
              data: { 
                orbiuns: result.sample_orbiuns || [], 
                total: result.sample_orbiuns?.length || 0 
              },
              message: `Debug: ${result.rows_found} linhas encontradas na planilha`
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "Erro na conexão com Google Sheets",
              error: result.error
            });
          }
        } catch (error) {
          return res.status(200).json({
            success: false,
            message: "Erro ao tentar conectar com Google Sheets",
            error: error.message
          });
        }
      }
      
      // Para estatísticas
      if (action === 'estatisticas') {
        return res.status(200).json({
          success: true,
          data: {
            total: 121,
            em_atendimento: 16,
            resolvidos: 89,
            problema: 16,
            resolvidos_hoje: 5,
            resolvidos_30_dias: 25
          },
          message: "Debug: Estatísticas simuladas"
        });
      }
      
      // Para cadastrar, vamos tentar realmente cadastrar
      if (action === 'cadastrar') {
        return await tentarCadastroReal(req, res);
      }
      
      // Outras ações
      return res.status(200).json({
        success: true,
        message: `Debug: Ação ${action} recebida`,
        body: req.body,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não suportado`
    });
    
  } catch (error) {
    console.error('=== ERROR DEBUG ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: error.message,
      error_type: error.constructor.name,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

async function testarConexaoSheets() {
  try {
    console.log('=== TESTANDO GOOGLE SHEETS ===');
    
    // Tentar importar googleapis
    const { google } = await import('googleapis');
    console.log('✅ googleapis importado');
    
    // Tentar parsear credenciais
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    if (!credentialsJson) {
      throw new Error('GOOGLE_CREDENTIALS_JSON não configurado');
    }
    
    const credentials = JSON.parse(credentialsJson);
    console.log('✅ Credenciais parseadas');
    console.log('Client email:', credentials.client_email);
    
    // Tentar criar auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('✅ Auth criado');
    
    // Tentar criar cliente sheets
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Cliente sheets criado');
    
    // Tentar ler planilha COMPLETA
    const SPREADSHEET_ID = '1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Dados!A:N', // Todas as colunas que usamos
    });
    
    console.log('✅ Planilha lida com sucesso');
    console.log('Rows found:', response.data.values?.length || 0);
    
    // Converter TODOS os orbiuns
    const rows = response.data.values;
    const all_orbiuns = [];
    
    if (rows && rows.length > 1) {
      // Processar TODAS as linhas (pular cabeçalho)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        
        // Só adicionar se a linha não estiver vazia
        if (row[0] || row[1] || row[12]) { // Se tem status, orbium ou nome_cliente
          all_orbiuns.push({
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
          });
        }
      }
    }
    
    console.log('✅ Orbiuns processados:', all_orbiuns.length);
    
    return {
      success: true,
      spreadsheet_id: SPREADSHEET_ID,
      rows_found: rows?.length || 0,
      orbiuns_processados: all_orbiuns.length,
      sample_orbiuns: all_orbiuns, // Agora retorna TODOS
      first_rows: rows?.slice(0, 3) || []
    };
    
  } catch (error) {
    console.error('❌ Erro na conexão com Sheets:', error);
    
    return {
      success: false,
      error: error.message,
      error_type: error.constructor.name
    };
  }
}

// Função auxiliar para formatar datas
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

async function tentarCadastroReal(req, res) {
  try {
    console.log('=== TENTANDO CADASTRO REAL ===');
    console.log('Orbium data:', req.body.orbium);
    
    const { orbium: dadosOrbium } = req.body;
    
    if (!dadosOrbium) {
      return res.status(200).json({
        success: false,
        message: "Campo 'orbium' não encontrado",
        dados_recebidos: req.body
      });
    }
    
    // Importar googleapis
    const { google } = await import('googleapis');
    
    // Configurar auth
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    const credentials = JSON.parse(credentialsJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Preparar dados
    const novaLinha = [
      dadosOrbium.status || 'Em atendimento',
      dadosOrbium.orbium || '',
      dadosOrbium.data_abertura || new Date().toLocaleDateString('pt-BR'),
      dadosOrbium.departamento || '',
      dadosOrbium.vendedor || '',
      dadosOrbium.recibo || '',
      dadosOrbium.reserva || '',
      dadosOrbium.pedido || '',
      dadosOrbium.cia || '',
      dadosOrbium.loc_gds || '',
      dadosOrbium.loc_cia || '',
      dadosOrbium.observacoes || '',
      dadosOrbium.nome_cliente || '',
      dadosOrbium.whats_cliente || ''
    ];
    
    console.log('Linha a inserir:', novaLinha);
    
    // Tentar inserir
    const SPREADSHEET_ID = '1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc';
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Dados!A:N',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [novaLinha]
      }
    });
    
    console.log('Resultado da inserção:', result.status);
    console.log('Updates:', result.data.updates);
    
    return res.status(200).json({
      success: true,
      message: `Orbium ${dadosOrbium.orbium} cadastrado com sucesso!`,
      debug_info: {
        linha_inserida: novaLinha,
        result_status: result.status,
        updates: result.data.updates
      },
      data: { orbium: dadosOrbium.orbium }
    });
    
  } catch (error) {
    console.error('❌ Erro no cadastro real:', error);
    
    return res.status(200).json({
      success: false,
      message: "Erro no cadastro real",
      error: error.message,
      stack: error.stack,
      dados_recebidos: req.body
    });
  }
}
