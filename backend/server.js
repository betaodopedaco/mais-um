const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// SUA CHAVE OPENAI VAI AQUI (vamos configurar depois)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sua_chave_aqui'
});

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    console.log('📨 Recebendo tradução:', { sourceLang, targetLang, textLength: text.length });

    const prompt = `Traduza este texto do ${sourceLang} para ${targetLang} de forma natural e precisa:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um tradutor profissional. Traduza de forma natural e precisa."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const translatedText = completion.choices[0]?.message?.content?.trim();
    
    console.log('✅ Tradução concluída');
    res.json({ 
      success: true,
      translatedText 
    });

  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro na tradução: ' + error.message 
    });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: '🚀 Backend funcionando!', status: 'online' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🎯 Backend rodando na porta ${PORT}`);
});
