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
                            <button onclick="uploadToYouTube('${videoUrl}')" class="btn btn-youtube">
                                📺 Upload to YouTube
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

// Upload video to YouTube (automatic with OAuth2)
async function uploadToYouTube(videoUrl) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    try {
        // Show loading state
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Checking authentication...';
        
        // Check authentication status
        const authStatusResponse = await fetch('/api/youtube/auth-status');
        const authStatus = await authStatusResponse.json();

        if (!authStatus.configured) {
            alert('YouTube OAuth2 is not configured.\n\nPlease set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in your .env file.');
            btn.disabled = false;
            btn.textContent = originalText;
            return;
        }

        if (!authStatus.authenticated) {
            // Need to authenticate first
            btn.innerHTML = '<span class="spinner"></span> Redirecting to authenticate...';
            
            const authUrlResponse = await fetch('/api/youtube/auth-url');
            const authUrlData = await authUrlResponse.json();
            
            if (authUrlData.success) {
                // Open auth URL in new window
                const authWindow = window.open(authUrlData.authUrl, 'YouTube Authentication', 'width=600,height=700');
                
                alert('Please complete the authentication in the popup window.\n\nAfter authenticating, close the popup and click "Upload to YouTube" again.');
            }
            
            btn.disabled = false;
            btn.textContent = originalText;
            return;
        }

        // User is authenticated, proceed with upload
        btn.innerHTML = '<span class="spinner"></span> Uploading to YouTube...';

        const response = await fetch('/api/youtube/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoUrl: videoUrl,
                metadata: {
                    title: 'AI Generated Video - ' + new Date().toLocaleDateString(),
                    description: 'Video generated using Blackbox AI Video Generator\n\nGenerated on: ' + new Date().toLocaleString(),
                    tags: ['AI Generated', 'Blackbox AI', 'Video Generation'],
                    privacyStatus: 'private'
                }
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(`✓ Video uploaded successfully to YouTube!\n\nTitle: ${result.title}\nVideo ID: ${result.videoId}\n\nOpening YouTube video...`);
            // Open YouTube video in new tab
            window.open(result.videoUrl, '_blank');
        } else if (result.authRequired) {
            alert('Authentication required. Please authenticate and try again.');
            if (result.authUrl) {
                window.open(result.authUrl, 'YouTube Authentication', 'width=600,height=700');
            }
        } else {
            alert('Upload failed: ' + (result.error || result.message));
        }

        btn.disabled = false;
        btn.textContent = originalText;

    } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading to YouTube: ' + error.message);
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// Show YouTube upload instructions in a modal
function showYouTubeInstructions(data) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>📺 Upload to YouTube</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="info-message">
                    ℹ️ YouTube requires OAuth2 authentication for automatic uploads. Follow these steps to upload manually:
                </div>
                
                <div class="metadata-section">
                    <h3>Suggested Metadata:</h3>
                    <div class="metadata-item">
                        <strong>Title:</strong>
                        <div class="metadata-value">${data.metadata.title}</div>
                    </div>
                    <div class="metadata-item">
                        <strong>Description:</strong>
                        <div class="metadata-value">${data.metadata.description}</div>
                    </div>
                    <div class="metadata-item">
                        <strong>Tags:</strong>
                        <div class="metadata-value">${data.metadata.tags}</div>
                    </div>
                    <div class="metadata-item">
                        <strong>Privacy:</strong>
                        <div class="metadata-value">${data.metadata.privacy}</div>
                    </div>
                </div>

                <div class="instructions-section">
                    <h3>Upload Instructions:</h3>
                    <ol class="instructions-list">
                        ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                </div>

                <div class="video-link-section">
                    <strong>Video URL:</strong>
                    <div class="video-link">
                        <input type="text" value="${data.videoUrl}" readonly id="youtubeVideoUrl">
                        <button onclick="copyYouTubeUrl()" class="btn btn-secondary btn-small">Copy</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="${data.videoUrl}" download="generated-video.mp4" class="btn btn-download">
                    📥 Download Video
                </a>
                <a href="https://studio.youtube.com" target="_blank" class="btn btn-youtube">
                    Open YouTube Studio
                </a>
                <button onclick="closeModal()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Copy YouTube video URL from modal
function copyYouTubeUrl() {
    const input = document.getElementById('youtubeVideoUrl');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Initialize
checkApiHealth();
