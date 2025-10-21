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
        // Extract video URL from various possible response formats
        let videoUrl = null;
        
        if (data) {
            // Try different possible locations for the video URL
            videoUrl = data.url || 
                      data.video_url || 
                      data.videoUrl ||
                      data.choices?.[0]?.message?.content ||
                      data.data?.url ||
                      data.data?.video_url;
            
            // If content is a string that looks like a URL
            if (typeof videoUrl === 'string' && videoUrl.match(/^https?:\/\//)) {
                html = `
                    <div class="success-message">✓ ${message}</div>
                    <div class="video-container">
                        <video id="generatedVideo" controls preload="metadata">
                            <source src="${videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="video-actions">
                            <a href="${videoUrl}" download="generated-video.mp4" class="btn btn-download">
                                📥 Download Video
                            </a>
                            <button onclick="copyToClipboard('${videoUrl}')" class="btn btn-secondary">
                                📋 Copy Link
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // If we can't find a direct video URL, show the response data
                html = `
                    <div class="success-message">✓ ${message}</div>
                    <div class="info-message">
                        ℹ️ Video URL not found in expected format. Here's the response:
                    </div>
                    <span class="info-label">Response Data:</span>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            }
        } else {
            html = `<div class="success-message">✓ ${message}</div>`;
        }
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

// Copy video URL to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Initialize
checkApiHealth();
