// Check API health on page load
async function checkApiHealth() {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');

    try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (data.status === 'ok' && data.apiConfigured) {
            statusBar.className = 'status-bar success';
            statusText.textContent = '✓ API Connected and Ready';
        } else if (data.status === 'ok' && !data.apiConfigured) {
            statusBar.className = 'status-bar warning';
            statusText.textContent = '⚠ API Key Not Configured - Please set BLACKBOX_API_KEY in .env file';
        } else {
            statusBar.className = 'status-bar error';
            statusText.textContent = '✗ API Connection Failed';
        }
    } catch (error) {
        statusBar.className = 'status-bar error';
        statusText.textContent = '✗ Cannot connect to server';
    }
}

// Handle form submission
document.getElementById('videoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    const prompt = promptInput.value.trim();

    if (!prompt) {
        showResult('error', 'Please enter a prompt');
        return;
    }

    // Disable form and show loading
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    resultCard.style.display = 'none';

    try {
        const response = await fetch('/api/video/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (data.success) {
            showResult('success', 'Video generation request successful!', data.data);
        } else {
            showResult('error', data.error || 'Failed to generate video');
        }
    } catch (error) {
        showResult('error', 'Network error: ' + error.message);
    } finally {
        // Re-enable form
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Show result in the result card
function showResult(type, message, data = null) {
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    let html = '';

    if (type === 'success') {
        html = `
            <div class="success-message">✓ ${message}</div>
            ${data ? `
                <span class="info-label">Response Data:</span>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            ` : ''}
        `;
    } else {
        html = `
            <div class="error-message">✗ ${message}</div>
        `;
    }

    resultContent.innerHTML = html;
    resultCard.style.display = 'block';

    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize
checkApiHealth();
