const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota de tradução
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang, context = '' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    const sourceLangName = getLanguageName(sourceLang);
    const targetLangName = getLanguageName(targetLang);

    const prompt = `
Você é um tradutor profissional especializado em tradução de documentos.

CONTEXTO ANTERIOR (para manter consistência):
${context}

TEXTO ORIGINAL (${sourceLangName}):
${text}

INSTRUÇÕES:
1. Traduza fielmente do ${sourceLangName} para ${targetLangName}
2. Mantenha termos técnicos, nomes próprios e formatação
3. Use linguagem natural e fluida
4. Preserve o significado original
5. Mantenha consistência com o contexto fornecido

TRADUÇÃO (${targetLangName}):
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um tradutor profissional especializado em tradução precisa e contextual de documentos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const translatedText = completion.choices[0]?.message?.content?.trim() || '[Tradução não disponível]';

    res.json({ translatedText });

  } catch (error) {
    console.error('Erro na tradução:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

function getLanguageName(code) {
  const languages = {
    'en': 'Inglês',
    'es': 'Espanhol', 
    'fr': 'Francês',
    'de': 'Alemão',
    'it': 'Italiano',
    'pt': 'Português',
    'ja': 'Japonês',
    'ko': 'Coreano',
    'zh': 'Chinês',
    'ru': 'Russo'
  };
  return languages[code] || code;
}

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
