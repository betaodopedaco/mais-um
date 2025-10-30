async function callOpenAI(text, sourceLang, targetLang, context = '') {
  const response = await fetch('http://localhost:3001/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      sourceLang,
      targetLang,
      context
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro na tradução');
  }

  const data = await response.json();
  return data.translatedText;
}
