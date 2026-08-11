const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messagesArea = document.getElementById('messages-area');
const sendBtn = document.getElementById('send-btn');

// API endpoint configuration
// Assuming the RAG backend is running locally on port 5000
const API_URL = 'http://localhost:5000/api/chat/ask';

// Auto-fill input from suggestion chips
function fillInput(text) {
    chatInput.value = text;
    chatInput.focus();
}

// Generate unique ID for messages
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Create and append user message
function appendUserMessage(text) {
    const id = generateId();
    const html = `
        <div class="message user-message" id="msg-${id}">
            <div class="avatar">
                <i data-feather="user"></i>
            </div>
            <div class="message-content">
                <p>${escapeHTML(text)}</p>
            </div>
        </div>
    `;
    messagesArea.insertAdjacentHTML('beforeend', html);
    feather.replace();
    scrollToBottom();
    return id;
}

// Show typing indicator
function showTypingIndicator() {
    const id = 'typing-' + generateId();
    const html = `
        <div class="message assistant-message" id="${id}">
            <div class="avatar">
                <i data-feather="bot"></i>
            </div>
            <div class="message-content" style="padding: 0; background: transparent; border: none; box-shadow: none;">
                <div class="typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    `;
    messagesArea.insertAdjacentHTML('beforeend', html);
    feather.replace();
    scrollToBottom();
    return id;
}

// Remove typing indicator
function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Render markdown (very basic implementation, for production use marked.js)
function renderMarkdown(text) {
    // Bold
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code inline
    html = html.replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>');
    // Paragraphs
    html = html.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');
    return html;
}

// Append Assistant Message with optional sources
function appendAssistantMessage(answer, sources = []) {
    const id = generateId();
    
    let sourcesHtml = '';
    if (sources && sources.length > 0) {
        const sourceCards = sources.map(source => `
            <div class="source-card">
                <div class="source-header">
                    <span>${escapeHTML(source.filename)}</span>
                    <span style="opacity: 0.7; font-size: 0.8rem;">Score: ${(source.similarity || 0).toFixed(2)}</span>
                </div>
                <div class="source-snippet">${escapeHTML(source.content)}</div>
            </div>
        `).join('');

        sourcesHtml = `
            <div class="sources-container">
                <div class="sources-title">
                    <i data-feather="book-open" style="width: 14px; height: 14px;"></i>
                    Sources Cited
                </div>
                ${sourceCards}
            </div>
        `;
    }

    const html = `
        <div class="message assistant-message" id="msg-${id}">
            <div class="avatar">
                <i data-feather="bot"></i>
            </div>
            <div class="message-content">
                ${renderMarkdown(answer)}
                ${sourcesHtml}
            </div>
        </div>
    `;
    
    messagesArea.insertAdjacentHTML('beforeend', html);
    feather.replace();
    scrollToBottom();
}

function appendErrorMessage(text) {
    const id = generateId();
    const html = `
        <div class="message assistant-message" id="msg-${id}">
            <div class="avatar" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5);">
                <i data-feather="alert-circle"></i>
            </div>
            <div class="message-content" style="border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05);">
                <p style="color: #ef4444;">${escapeHTML(text)}</p>
            </div>
        </div>
    `;
    messagesArea.insertAdjacentHTML('beforeend', html);
    feather.replace();
    scrollToBottom();
}

function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Helper to escape HTML and prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const question = chatInput.value.trim();
    if (!question) return;

    // Clear input and disable button
    chatInput.value = '';
    sendBtn.disabled = true;

    // Show user message
    appendUserMessage(question);
    
    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        removeMessage(typingId);

        if (data.success) {
            appendAssistantMessage(data.answer, data.sources);
        } else {
            appendErrorMessage(data.message || 'An error occurred processing your request.');
        }

    } catch (error) {
        removeMessage(typingId);
        console.error('Fetch error:', error);
        appendErrorMessage('Failed to connect to the RAG backend. Make sure the server is running on port 5000.');
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
});

// --- Knowledge Base Logic --- //
const tabChat = document.getElementById('tab-chat');
const tabKb = document.getElementById('tab-kb');
const chatView = document.querySelector('.chat-container');
const kbView = document.getElementById('kb-view');
const fileDropArea = document.getElementById('file-drop-area');
const fileInput = document.getElementById('file-input');
const fileMsg = document.querySelector('.file-msg');
const uploadBtn = document.getElementById('upload-btn');
const uploadForm = document.getElementById('upload-form');
const uploadStatus = document.getElementById('upload-status');
const documentsList = document.getElementById('documents-list');

const DOCS_API_URL = 'http://localhost:5000/api/documents';

// Tab Switching
function switchTab(tabName) {
    if (tabName === 'chat') {
        tabChat.classList.add('active');
        tabKb.classList.remove('active');
        chatView.classList.remove('hidden');
        kbView.classList.add('hidden');
    } else {
        tabKb.classList.add('active');
        tabChat.classList.remove('active');
        kbView.classList.remove('hidden');
        chatView.classList.add('hidden');
        fetchDocuments();
    }
}

tabChat.addEventListener('click', () => switchTab('chat'));
tabKb.addEventListener('click', () => switchTab('kb'));

// File Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, () => fileDropArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, () => fileDropArea.classList.remove('dragover'), false);
});

fileDropArea.addEventListener('drop', (e) => {
    let dt = e.dataTransfer;
    let files = dt.files;
    if (files.length) {
        fileInput.files = files;
        updateFileDisplay();
    }
}, false);

fileInput.addEventListener('change', updateFileDisplay);

function updateFileDisplay() {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (!file.name.endsWith('.txt')) {
            showUploadStatus('Only .txt files are supported', 'error');
            fileInput.value = '';
            fileMsg.textContent = 'Drag & drop your .txt file here or click to browse';
            uploadBtn.disabled = true;
            return;
        }
        fileMsg.textContent = file.name;
        uploadBtn.disabled = false;
        showUploadStatus('', '');
    } else {
        fileMsg.textContent = 'Drag & drop your .txt file here or click to browse';
        uploadBtn.disabled = true;
    }
}

function showUploadStatus(msg, type) {
    uploadStatus.textContent = msg;
    uploadStatus.className = 'upload-status ' + type;
}

// Upload Handling
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    showUploadStatus('', '');

    try {
        const response = await fetch(`${DOCS_API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            showUploadStatus('Document uploaded and embedded successfully!', 'success');
            fileInput.value = '';
            updateFileDisplay();
            fetchDocuments();
        } else {
            showUploadStatus(data.message || 'Upload failed', 'error');
        }
    } catch (error) {
        console.error('Upload Error:', error);
        showUploadStatus('Network error uploading document', 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Document';
    }
});

// Fetch and Render Documents
async function fetchDocuments() {
    documentsList.innerHTML = '<div class="loading-docs">Loading documents...</div>';
    
    try {
        const response = await fetch(DOCS_API_URL);
        const data = await response.json();

        if (data.success) {
            renderDocuments(data.documents);
        } else {
            documentsList.innerHTML = `<div style="color:#ef4444">Failed to load documents</div>`;
        }
    } catch (error) {
        console.error('Error fetching docs:', error);
        documentsList.innerHTML = `<div style="color:#ef4444">Network error loading documents. Is the backend running?</div>`;
    }
}

function renderDocuments(docs) {
    if (!docs || docs.length === 0) {
        documentsList.innerHTML = '<div style="color:var(--text-secondary)">No documents uploaded yet.</div>';
        return;
    }

    const html = docs.map(doc => {
        const date = new Date(doc.created_at).toLocaleDateString();
        return `
            <div class="doc-card">
                <div class="doc-info">
                    <div class="doc-name">
                        <i data-feather="file-text" style="width:16px;height:16px;"></i>
                        ${escapeHTML(doc.filename)}
                    </div>
                    <div class="doc-meta">Uploaded on ${date}</div>
                </div>
                <div class="doc-badge">${doc.chunk_count} Chunks</div>
            </div>
        `;
    }).join('');

    documentsList.innerHTML = html;
    feather.replace();
}
