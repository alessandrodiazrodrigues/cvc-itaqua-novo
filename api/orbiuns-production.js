export default async function handler(req, res) {
  console.log('🚀 === ORBIUNS API PRODUCTION v1.4 - SECURE ===');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🔧 Método:', req.method);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const PLANILHA_ID = '1A7HOrMOw60Rks4_fwj0BNP5i9cZQ9H-dOJ7LKFw5Jis';
  const ABA_DADOS = 'Dados';
  const SENHA_ORBIUNS = 'orb123';

  try {
    // ⚠️ USAR APENAS VARIÁVEIS DE AMBIENTE - NUNCA CREDENCIAIS FIXAS
    const { google } = await import('googleapis');
    
    console.log('🔑 Configurando autenticação Google...');
    
    // Verificar se a variável de ambiente existe
    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
      console.error('❌ GOOGLE_CREDENTIALS_JSON não configurado no Vercel');
      return res.status(500).json({
        success: false,
        error: 'Credenciais do Google não configuradas',
        details: 'Configure GOOGLE_CREDENTIALS_JSON nas variáveis de ambiente do Vercel'
      });
    }

    // Usar APENAS as credenciais das variáveis de ambiente
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    console.log('✅ Credenciais carregadas das variáveis de ambiente');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Autenticação Google configurada com sucesso');

    // =========================================================================
    // 📋 LISTAR ORBIUNS
    // =========================================================================
    if (req.method === 'GET' || (req.method === 'POST' && req.body?.action === 'listar')) {
      console.log('📋 === LISTANDO ORBIUNS ===');
      
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: PLANILHA_ID,
          range: `${ABA_DADOS}!A:N`,
        });

        const rows = response.data.values || [];
        console.log('📊 Total de linhas encontradas:', rows.length);

        if (rows.length <= 1) {
          return res.status(200).json({
            success: true,
            data: { orbiuns: [], total: 0 },
            message: 'Nenhum orbium encontrado na planilha'
          });
        }

        const headers = rows[0];
        const orbiuns = rows.slice(1).map((row, index) => {
          const orbium = {};
          headers.forEach((header, i) => {
            orbium[header.toLowerCase().replace(/\s+/g, '_')] = row[i] || '';
          });
          orbium.id = (index + 2).toString(); // ID baseado na linha (começando em 2)
          return orbium;
        });

        console.log('✅ Orbiuns processados:', orbiuns.length);

        return res.status(200).json({
          success: true,
          data: { orbiuns, total: orbiuns.length },
          message: `${orbiuns.length} orbiuns carregados com sucesso`
        });

      } catch (error) {
        console.error('❌ Erro ao listar orbiuns:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao carregar orbiuns da planilha',
          details: error.message
        });
      }
    }

    // =========================================================================
    // ➕ CADASTRAR NOVO ORBIUM
    // =========================================================================
    if (req.method === 'POST' && req.body?.action === 'cadastrar') {
      console.log('➕ === CADASTRANDO NOVO ORBIUM ===');
      
      const { orbium, senha } = req.body;
      
      if (senha !== SENHA_ORBIUNS) {
        return res.status(401).json({
          success: false,
          error: 'Senha incorreta'
        });
      }

      if (!orbium?.orbium) {
        return res.status(400).json({
          success: false,
          error: 'Número do orbium é obrigatório'
        });
      }

      try {
        // Verificar se orbium já existe
        const existing = await sheets.spreadsheets.values.get({
          spreadsheetId: PLANILHA_ID,
          range: `${ABA_DADOS}!B:B`,
        });

        const existingOrbiuns = existing.data.values?.flat() || [];
        if (existingOrbiuns.includes(orbium.orbium)) {
          return res.status(400).json({
            success: false,
            error: `Orbium ${orbium.orbium} já existe na planilha`
          });
        }

        // Preparar dados para inserção (seguindo a estrutura da planilha)
        const novaLinha = [
          orbium.status || 'Em atendimento',
          orbium.orbium,
          orbium.data_abertura || new Date().toISOString().split('T')[0],
          orbium.departamento || '',
          orbium.vendedor || '',
          orbium.nome_cliente || '',
          orbium.whats_cliente || '',
          orbium.observacoes || '',
          orbium.recibo || '',
          orbium.reserva || '',
          orbium.cia || '',
          orbium.loc_gds || orbium.localizador || '',
          orbium.data_resolucao || '',
          orbium.data_atualizacao || new Date().toISOString()
        ];

        console.log('📝 Linha a inserir:', novaLinha);

        // Inserir na planilha
        const result = await sheets.spreadsheets.values.append({
          spreadsheetId: PLANILHA_ID,
          range: `${ABA_DADOS}!A:N`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [novaLinha]
          }
        });

        console.log('✅ Resultado da inserção:', result.status);
        console.log('📊 Updates:', result.data.updates);

        return res.status(200).json({
          success: true,
          message: `Orbium ${orbium.orbium} cadastrado com sucesso!`,
          data: { orbium: novaLinha }
        });

      } catch (error) {
        console.error('❌ Erro ao cadastrar orbium:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao cadastrar orbium',
          details: error.message
        });
      }
    }

    // =========================================================================
    // 🔄 ATUALIZAR STATUS DO ORBIUM
    // =========================================================================
    if (req.method === 'POST' && req.body?.action === 'atualizar_status') {
      console.log('🔄 === ATUALIZANDO STATUS DO ORBIUM ===');
      
      const { id, status, observacoes, senha } = req.body;
      
      if (senha !== SENHA_ORBIUNS) {
        return res.status(401).json({
          success: false,
          error: 'Senha incorreta'
        });
      }

      if (!id || !status) {
        return res.status(400).json({
          success: false,
          error: 'ID e status são obrigatórios'
        });
      }

      try {
        console.log(`📍 Atualizando linha ${id} para status: ${status}`);

        // Calcular a linha (ID é baseado na linha da planilha)
        const linhaPlanilha = parseInt(id);
        
        // Preparar atualizações
        const updates = [];
        
        // Atualizar status (coluna A)
        updates.push({
          range: `${ABA_DADOS}!A${linhaPlanilha}`,
          values: [[status]]
        });

        // Atualizar observações se fornecidas (coluna H)
        if (observacoes) {
          updates.push({
            range: `${ABA_DADOS}!H${linhaPlanilha}`,
            values: [[observacoes]]
          });
        }

        // Atualizar data de resolução se status for "Resolvido" (coluna M)
        if (status === 'Resolvido') {
          updates.push({
            range: `${ABA_DADOS}!M${linhaPlanilha}`,
            values: [[new Date().toISOString().split('T')[0]]]
          });
        }

        // Sempre atualizar data de atualização (coluna N)
        updates.push({
          range: `${ABA_DADOS}!N${linhaPlanilha}`,
          values: [[new Date().toISOString()]]
        });

        console.log('📝 Atualizações a fazer:', updates.length);

        // Executar todas as atualizações
        const result = await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: PLANILHA_ID,
          resource: {
            valueInputOption: 'USER_ENTERED',
            data: updates
          }
        });

        console.log('✅ Resultado da atualização:', result.status);
        console.log('📊 Células atualizadas:', result.data.totalUpdatedCells);

        return res.status(200).json({
          success: true,
          message: `Orbium ${id} atualizado para status: ${status}`,
          data: { 
            id, 
            status, 
            observacoes,
            celulasAtualizadas: result.data.totalUpdatedCells
          }
        });

      } catch (error) {
        console.error('❌ Erro ao atualizar status:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao atualizar status do orbium',
          details: error.message
        });
      }
    }

    // =========================================================================
    // 📊 ESTATÍSTICAS
    // =========================================================================
    if (req.method === 'POST' && req.body?.action === 'estatisticas') {
      console.log('📊 === CARREGANDO ESTATÍSTICAS ===');
      
      try {
        // Buscar todos os dados
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: PLANILHA_ID,
          range: `${ABA_DADOS}!A:M`,
        });

        const rows = response.data.values || [];
        
        if (rows.length <= 1) {
          return res.status(200).json({
            success: true,
            data: {
              total: 0,
              em_atendimento: 0,
              resolvidos: 0,
              problema: 0,
              resolvidos_hoje: 0,
              resolvidos_semana: 0
            },
            message: 'Estatísticas calculadas (planilha vazia)'
          });
        }

        const orbiuns = rows.slice(1); // Remove header
        const hoje = new Date().toISOString().split('T')[0];
        const inicioDaSemana = new Date();
        inicioDaSemana.setDate(inicioDaSemana.getDate() - inicioDaSemana.getDay());
        const inicioDaSemanaStr = inicioDaSemana.toISOString().split('T')[0];

        const stats = {
          total: orbiuns.length,
          em_atendimento: orbiuns.filter(row => row[0] === 'Em atendimento').length,
          resolvidos: orbiuns.filter(row => row[0] === 'Resolvido').length,
          problema: orbiuns.filter(row => row[0] === 'Problema').length,
          resolvidos_hoje: orbiuns.filter(row => 
            row[0] === 'Resolvido' && row[12] === hoje
          ).length,
          resolvidos_semana: orbiuns.filter(row => 
            row[0] === 'Resolvido' && row[12] >= inicioDaSemanaStr
          ).length
        };

        console.log('📊 Estatísticas calculadas:', stats);

        return res.status(200).json({
          success: true,
          data: stats,
          message: 'Estatísticas calculadas com sucesso'
        });

      } catch (error) {
        console.error('❌ Erro ao calcular estatísticas:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao calcular estatísticas',
          details: error.message
        });
      }
    }

    // Ação não reconhecida
    return res.status(400).json({
      success: false,
      error: 'Ação não reconhecida',
      actions_disponiveis: ['listar', 'cadastrar', 'atualizar_status', 'estatisticas']
    });

  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
}
