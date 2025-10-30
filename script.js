// Estado da aplicação
let currentState = {
    file: null,
    currentPage: 1,
    totalPages: 1,
    pages: [],
    translatedPages: []
};

// Elementos DOM
const elements = {
    fileInput: document.getElementById('file-input'),
    fileName: document.getElementById('file-name'),
    translateBtn: document.getElementById('translate-btn'),
    results: document.getElementById('results'),
    loading: document.getElementById('loading'),
    fileInfo: document.getElementById('file-info'),
    pageIndicator: document.getElementById('page-indicator'),
    originalText: document.getElementById('original-text'),
    translatedText: document.getElementById('translated-text'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    dropZone: document.getElementById('drop-zone')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.dropZone.addEventListener('dragover', handleDragOver);
    elements.dropZone.addEventListener('dragleave', handleDragLeave);
    elements.dropZone.addEventListener('drop', handleFileDrop);
    
    // Click on drop zone
    elements.dropZone.addEventListener('click', function() {
        elements.fileInput.click();
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        setFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    elements.dropZone.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    elements.dropZone.classList.remove('dragover');
}

function handleFileDrop(event) {
    event.preventDefault();
    elements.dropZone.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file) {
        setFile(file);
    }
}

function setFile(file) {
    // Verifica tipo de arquivo
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(file.type) && !['txt', 'pdf', 'docx'].includes(fileExtension)) {
        alert('Tipo de arquivo não suportado. Use TXT, PDF ou DOCX.');
        return;
    }
    
    // Verifica tamanho
    if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB.');
        return;
    }
    
    currentState.file = file;
    elements.fileName.textContent = `✓ ${file.name}`;
    elements.fileName.style.color = '#10b981';
    elements.translateBtn.disabled = false;
    
    // Esconde resultados anteriores
    elements.results.classList.add('hidden');
}

async function translateDocument() {
    if (!currentState.file) {
        alert('Por favor, selecione um arquivo primeiro.');
        return;
    }
    
    // Mostra loading
    elements.loading.classList.remove('hidden');
    
    try {
        // Lê o arquivo
        const text = await readFile(currentState.file);
        
        // Divide em páginas
        currentState.pages = splitIntoPages(text);
        currentState.totalPages = currentState.pages.length;
        currentState.currentPage = 1;
        
        // Simula tradução (substituir por API real depois)
        currentState.translatedPages = simulateTranslation(currentState.pages);
        
        // Atualiza UI
        updateResultsUI();
        elements.results.classList.remove('hidden');
        
    } catch (error) {
        alert('Erro ao processar arquivo: ' + error.message);
    } finally {
        elements.loading.classList.add('hidden');
    }
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(e) {
            reject(new Error('Erro ao ler arquivo'));
        };
        
        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // Para PDF e DOCX, simula conteúdo por enquanto
            resolve(`Conteúdo do arquivo: ${file.name}\n\nEste é um exemplo de conteúdo que seria extraído do arquivo. Em uma implementação real, você precisaria de bibliotecas específicas para extrair texto de PDF e DOCX.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`);
        }
    });
}

function splitIntoPages(text, charsPerPage = 1500) {
    const pages = [];
    const words = text.split(' ');
    let currentPage = [];
    let currentLength = 0;
    
    for (const word of words) {
        if (currentLength + word.length + 1 > charsPerPage) {
            pages.push(currentPage.join(' '));
            currentPage = [word];
            currentLength = word.length;
        } else {
            currentPage.push(word);
            currentLength += word.length + 1;
        }
    }
    
    if (currentPage.length > 0) {
        pages.push(currentPage.join(' '));
    }
    
    return pages.slice(0, 10); // Máximo 10 páginas
}

function simulateTranslation(pages) {
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    
    return pages.map((page, index) => {
        return `[TRADUZIDO de ${getLanguageName(sourceLang)} para ${getLanguageName(targetLang)} - Página ${index + 1}]\n\n${page}\n\nEsta é uma simulação da tradução. Em uma implementação real, este texto seria traduzido pela API da OpenAI.`;
    });
}

function getLanguageName(code) {
    const languages = {
        'en': 'Inglês',
        'es': 'Espanhol',
        'fr': 'Francês',
        'de': 'Alemão',
        'pt': 'Português'
    };
    return languages[code] || code;
}

function updateResultsUI() {
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    
    // Atualiza informações do arquivo
    elements.fileInfo.textContent = 
        `${currentState.file.name} • ${getLanguageName(sourceLang)} → ${getLanguageName(targetLang)} • ${currentState.totalPages} páginas`;
    
    // Atualiza navegação
    updatePageNavigation();
    
    // Atualiza conteúdo da página atual
    showCurrentPage();
}

function updatePageNavigation() {
    elements.pageIndicator.textContent = 
        `Página ${currentState.currentPage} de ${currentState.totalPages}`;
    
    elements.prevBtn.disabled = currentState.currentPage === 1;
    elements.nextBtn.disabled = currentState.currentPage === currentState.totalPages;
}

function showCurrentPage() {
    const pageIndex = currentState.currentPage - 1;
    
    if (currentState.pages[pageIndex]) {
        elements.originalText.textContent = currentState.pages[pageIndex];
    }
    
    if (currentState.translatedPages[pageIndex]) {
        elements.translatedText.textContent = currentState.translatedPages[pageIndex];
    }
}

function changePage(direction) {
    const newPage = currentState.currentPage + direction;
    
    if (newPage >= 1 && newPage <= currentState.totalPages) {
        currentState.currentPage = newPage;
        updatePageNavigation();
        showCurrentPage();
    }
}

function downloadTranslation() {
    if (!currentState.translatedPages.length) {
        alert('Nenhuma tradução para download.');
        return;
    }
    
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    
    let content = `TRADUÇÃO: ${getLanguageName(sourceLang)} → ${getLanguageName(targetLang)}\n`;
    content += `Arquivo: ${currentState.file.name}\n`;
    content += `Data: ${new Date().toLocaleString()}\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    currentState.translatedPages.forEach((translated, index) => {
        content += `PÁGINA ${index + 1}\n\n`;
        content += `ORIGINAL (${getLanguageName(sourceLang)}):\n${currentState.pages[index]}\n\n`;
        content += `TRADUZIDO (${getLanguageName(targetLang)}):\n${translated}\n\n`;
        content += '='.repeat(50) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traduzido_${currentState.file.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
