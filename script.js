async function callBackendAPI(text, sourceLang, targetLang, context = '') {
  // SUBSTITUI pela URL que o Render vai te dar
  const BACKEND_URL = 'https://seu-backend.onrender.com';
  
  console.log('🌐 Enviando para backend...', { sourceLang, targetLang });
  
  const response = await fetch(`${BACKEND_URL}/api/translate`, {
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

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Erro na tradução');
  }

  console.log('✅ Resposta do backend recebida');
  return data.translatedText;
}
