// VERSÃO COM MODULE.EXPORTS

module.exports = function handler(req, res) {
    console.log('=== CVC API TESTE ===');
    
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    
    try {
        // Resposta fixa para teste
        return res.status(200).json({
            success: true,
            result: `*Iberia - São Paulo ✈ Lisboa*
11/07 - Guarulhos 19:15 / Lisboa 16:05 (+1) (com conexão)
--
23/07 - Lisboa 08:25 / Guarulhos 17:35 (com conexão)

💰 R$ 6.073,22 para 01 adulto
✅ Inclui 1 item pessoal + 1 mala de mão de 10kg
🏷️ Não reembolsável

Valores sujeitos a confirmação e disponibilidade (v3.2)`,
            ia_usada: 'teste',
            version: '3.2'
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
