'use client';

import { useState, useRef } from 'react';

export default function TradutorIA() {
  const [file, setFile] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('pt');
  const fileInputRef = useRef(null);

  const languages = [
    { code: 'en', name: 'Inglês' },
    { code: 'es', name: 'Espanhol' },
    { code: 'fr', name: 'Francês' },
    { code: 'de', name: 'Alemão' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleTranslate = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo');
      return;
    }

    setIsTranslating(true);
    
    // Simulação enquanto a API não está pronta
    setTimeout(() => {
      const mockResult = {
        filename: file.name,
        total_pages: 3,
        pages: [
          {
            page_number: 1,
            original: 'This is a sample text in English that needs to be translated to Portuguese.',
            translated: 'Este é um texto de exemplo em Inglês que precisa ser traduzido para Português.'
          },
          {
            page_number: 2,
            original: 'The quick brown fox jumps over the lazy dog. This sentence contains all letters of the English alphabet.',
            translated: 'A rápida raposa marrom salta sobre o cão preguiçoso. Esta frase contém todas as letras do alfabeto Inglês.'
          },
          {
            page_number: 3,
            original: 'Artificial intelligence is transforming how we work and live. Translation technology is becoming increasingly sophisticated.',
            translated: 'A inteligência artificial está transformando como trabalhamos e vivemos. A tecnologia de tradução está se tornando cada vez mais sofisticada.'
          }
        ],
        source_lang: sourceLang,
        target_lang: targetLang
      };
      
      setResult(mockResult);
      setCurrentPage(1);
      setIsTranslating(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    
    const content = result.pages.map(page => 
      `PÁGINA ${page.page_number}\n\nORIGINAL:\n${page.original}\n\nTRADUZIDO:\n${page.translated}\n\n${'='.repeat(50)}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traduzido_${result.filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentPageData = result?.pages.find(p => p.page_number === currentPage);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
            🚀 Tradutor IA
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            Traduza documentos com IA contextual
          </p>
        </div>

        {/* Upload Section */}
        <div style={{ padding: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '30px' 
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                🌍 Idioma de Origem
              </label>
              <select 
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                🌍 Idioma de Destino
              </label>
              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div style={{ 
            border: '2px dashed #d1d5db',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px',
            transition: 'border-color 0.3s'
          }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.txt"
              style={{ display: 'none' }}
            />
            
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📁</div>
            
            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
              {file ? (
                <span style={{ color: '#10b981' }}>✓ {file.name}</span>
              ) : (
                'Arraste ou clique para selecionar arquivo'
              )}
            </p>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              PDF, Word (.docx) ou Texto (.txt) • Máx. 10MB
            </p>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Selecionar Arquivo
            </button>
          </div>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={!file || isTranslating}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: !file || isTranslating ? 'not-allowed' : 'pointer',
              opacity: !file || isTranslating ? 0.6 : 1
            }}
          >
            {isTranslating ? (
              <>
                <div style={{ 
                  display: 'inline-block',
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid white', 
                  borderTop: '2px solid transparent',
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px'
                }} />
                Traduzindo com IA...
              </>
            ) : (
              '🚀 Traduzir Documento'
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ padding: '40px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Tradução Concluída 🎉
                </h2>
                <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
                  {result.filename} • {languages.find(l => l.code === result.source_lang)?.name} → {languages.find(l => l.code === result.target_lang)?.name} • {result.total_pages} páginas
                </p>
              </div>
              
              <button
                onClick={handleDownload}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                📥 Download Completo
              </button>
            </div>

            {/* Page Navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                ← Anterior
              </button>
              
              <span style={{ fontWeight: '600', color: '#374151' }}>
                Página {currentPage} de {result.total_pages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(result.total_pages, currentPage + 1))}
                disabled={currentPage === result.total_pages}
                style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: currentPage === result.total_pages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === result.total_pages ? 0.5 : 1
                }}
              >
                Próxima →
              </button>
            </div>

            {/* Content */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '30px'
            }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  📝 Texto Original ({languages.find(l => l.code === result.source_lang)?.name})
                </h3>
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '20px', 
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    color: '#1f2937',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {currentPageData?.original}
                  </pre>
                </div>
              </div>
              
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  📝 Texto Traduzido ({languages.find(l => l.code === result.target_lang)?.name})
                </h3>
                <div style={{ 
                  background: '#eff6ff', 
                  padding: '20px', 
                  borderRadius: '8px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    color: '#1f2937',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {currentPageData?.translated}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
