const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang, context = '' } = req.body;

    const sourceLangName = getLanguageName(sourceLang);
    const targetLangName = getLanguageName(targetLang);

    const prompt = `Traduza profissionalmente do ${sourceLangName} para ${targetLangName}.

CONTEXTO: ${context}

TEXTO: ${text}

TRADUÇÃO:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "Você é um tradutor profissional."
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
    
    res.json({ translatedText });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro na tradução' });
  }
});

function getLanguageName(code) {
  const languages = {
    'en': 'Inglês', 'es': 'Espanhol', 'fr': 'Francês', 'de': 'Alemão',
    'it': 'Italiano', 'pt': 'Português', 'ja': 'Japonês', 'ko': 'Coreano', 
    'zh': 'Chinês', 'ru': 'Russo'
  };
  return languages[code] || code;
}

app.listen(port, () => {
  console.log(`🚀 Backend rodando na porta ${port}`);
});
