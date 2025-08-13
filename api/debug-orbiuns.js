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
        return await testarConexaoSheets(res);
      }
      
      // Para cadastrar, vamos retornar os dados recebidos
      if (action === 'cadastrar') {
        console.log('=== CADASTRAR DEBUG ===');
        console.log('Orbium data:', req.body.orbium);
        
        return res.status(200).json({
          success: true,
          message: "Dados de cadastro recebidos (modo debug)",
          dados_recebidos: req.body,
          orbium_data: req.body.orbium,
          timestamp: new Date().toISOString()
        });
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

async function testarConexaoSheets(res) {
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
    
    // Tentar ler planilha
    const SPREADSHEET_ID = '1dF8dfIh8EyvX-5_sISpVc4dMsLNOqpwovQsbsxl9ywc';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Dados!A1:B5', // Só algumas células para teste
    });
    
    console.log('✅ Planilha lida com sucesso');
    console.log('Rows found:', response.data.values?.length || 0);
    
    return res.status(200).json({
      success: true,
      message: "Conexão com Google Sheets funcionando!",
      spreadsheet_id: SPREADSHEET_ID,
      rows_found: response.data.values?.length || 0,
      first_rows: response.data.values?.slice(0, 3) || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro na conexão com Sheets:', error);
    
    return res.status(500).json({
      success: false,
      message: "Erro na conexão com Google Sheets",
      error: error.message,
      error_type: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
}
