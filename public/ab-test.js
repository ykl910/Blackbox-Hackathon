// Store test data
let testData = {
    videoA: null,
    videoB: null,
    prompt: '',
    title: ''
};

// Check API health on page load
async function checkApiHealth() {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');

    try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (data.status === 'ok' && data.apiConfigured && data.youtubeAuthenticated) {
            statusBar.className = 'status-bar success';
            statusText.textContent = '✓ API Connected and YouTube Authenticated';
        } else if (data.status === 'ok' && data.apiConfigured && !data.youtubeAuthenticated) {
            statusBar.className = 'status-bar warning';
            statusText.textContent = '⚠ YouTube Not Authenticated - Please authenticate first';
        } else if (data.status === 'ok' && !data.apiConfigured) {
            statusBar.className = 'status-bar warning';
            statusText.textContent = '⚠ API Key Not Configured';
        } else {
            statusBar.className = 'status-bar error';
            statusText.textContent = '✗ API Connection Failed';
        }
    } catch (error) {
        statusBar.className = 'status-bar error';
        statusText.textContent = '✗ Cannot connect to server';
    }
}

// Handle form submission - Generate videos only
document.getElementById('abTestForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const promptInput = document.getElementById('prompt');
    const titleInput = document.getElementById('videoTitle');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');
    const progressCard = document.getElementById('progressCard');
    const generatedSection = document.getElementById('generatedSection');
    const comparisonSection = document.getElementById('comparisonSection');

    const prompt = promptInput.value.trim();
    const title = titleInput.value.trim() || 'A/B Test Video';

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    // Store test data
    testData.prompt = prompt;
    testData.title = title;

    // Disable form and show loading
    generateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    progressCard.style.display = 'block';
    generatedSection.style.display = 'none';
    comparisonSection.style.display = 'none';

    // Reset progress
    updateProgress('videoAStatus', 'Generating...', 'generating');
    updateProgress('videoBStatus', 'Generating...', 'generating');

    try {
        // Generate both videos in parallel
        const [resultA, resultB] = await Promise.all([
            generateVideo(prompt, 'A'),
            generateVideo(prompt, 'B')
        ]);

        if (resultA.success && resultB.success) {
            testData.videoA = resultA;
            testData.videoB = resultB;

            updateProgress('videoAStatus', '✓ Generated', 'complete');
            updateProgress('videoBStatus', '✓ Generated', 'complete');

            // Display generated videos for preview
            displayGeneratedVideos();
        } else {
            throw new Error('Failed to generate videos');
        }
    } catch (error) {
        console.error('Error:', error);
        updateProgress('videoAStatus', '✗ Error', 'error');
        updateProgress('videoBStatus', '✗ Error', 'error');
        alert('Error: ' + error.message);
    } finally {
        // Re-enable form
        generateBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Handle upload button click
document.getElementById('uploadBothBtn').addEventListener('click', async () => {
    const uploadBtn = document.getElementById('uploadBothBtn');
    const btnText = uploadBtn.querySelector('.upload-btn-text');
    const btnLoader = uploadBtn.querySelector('.upload-btn-loader');
    const progressCard = document.getElementById('progressCard');

    // Disable button and show loading
    uploadBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    progressCard.style.display = 'block';

    try {
        // Upload both videos to YouTube
        updateProgress('videoAStatus', 'Uploading to YouTube...', 'uploading');
        updateProgress('videoBStatus', 'Uploading to YouTube...', 'uploading');

        const [uploadA, uploadB] = await Promise.all([
            uploadToYouTube(testData.videoA.videoUrl, `Video A: ${testData.title}`),
            uploadToYouTube(testData.videoB.videoUrl, `Video B: ${testData.title}`)
        ]);

        if (uploadA.success && uploadB.success) {
            testData.videoA.youtubeId = uploadA.videoId;
            testData.videoA.youtubeUrl = uploadA.videoUrl;
            testData.videoB.youtubeId = uploadB.videoId;
            testData.videoB.youtubeUrl = uploadB.videoUrl;

            updateProgress('videoAStatus', '✓ Uploaded', 'complete');
            updateProgress('videoBStatus', '✓ Uploaded', 'complete');

            // Hide generated section, show comparison
            document.getElementById('generatedSection').style.display = 'none';

            // Display comparison
            displayComparison();

            // Fetch initial stats
            await fetchAndUpdateStats();
        } else {
            // Check for quota exceeded
            if (uploadA.quotaExceeded || uploadB.quotaExceeded) {
                throw new Error('YouTube upload quota exceeded. You can only upload a limited number of videos per day. Please try again tomorrow or use a different Google account.');
            }
            
            const errorMsg = uploadA.error || uploadB.error || 'Failed to upload videos to YouTube';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error:', error);
        updateProgress('videoAStatus', '✗ Error', 'error');
        updateProgress('videoBStatus', '✗ Error', 'error');
        alert('Error: ' + error.message);
    } finally {
        // Re-enable button
        uploadBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Generate a single video
async function generateVideo(prompt, version) {
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
            // Extract video URL from response
            const videoUrl = extractVideoUrl(data.data);
            return {
                success: true,
                videoUrl: videoUrl,
                data: data.data,
                version: version
            };
        } else {
            return {
                success: false,
                error: data.error
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Extract video URL from API response
function extractVideoUrl(data) {
    return data.url || 
           data.video_url || 
           data.videoUrl ||
           data.choices?.[0]?.message?.content ||
           data.data?.url ||
           data.data?.video_url;
}

// Upload video to YouTube
async function uploadToYouTube(videoUrl, title) {
    try {
        const response = await fetch('/api/youtube/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoUrl: videoUrl,
                title: title,
                description: `A/B Test Video - Generated with prompt: "${testData.prompt}"`,
                tags: ['AI', 'Generated', 'Blackbox', 'AB Test'],
                privacyStatus: 'public' // Make public for stats tracking
            })
        });

        const data = await response.json();
        
        // Check for quota exceeded error
        if (!data.success && data.error && data.error.includes('quota')) {
            return {
                success: false,
                error: 'YouTube upload quota exceeded. Please try again tomorrow or use a different Google account.',
                quotaExceeded: true
            };
        }
        
        return data;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Update progress status
function updateProgress(elementId, text, className) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    element.className = `progress-status ${className}`;
}

// Display generated videos for preview
function displayGeneratedVideos() {
    const generatedSection = document.getElementById('generatedSection');
    
    // Set video sources
    document.getElementById('videoAPreviewSource').src = testData.videoA.videoUrl;
    document.getElementById('videoBPreviewSource').src = testData.videoB.videoUrl;
    
    // Set download links
    document.getElementById('videoADownload').href = testData.videoA.videoUrl;
    document.getElementById('videoBDownload').href = testData.videoB.videoUrl;
    
    // Reload videos
    document.getElementById('videoAPreview').load();
    document.getElementById('videoBPreview').load();
    
    // Show generated section
    generatedSection.style.display = 'block';
    generatedSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display comparison section (after upload)
function displayComparison() {
    const comparisonSection = document.getElementById('comparisonSection');
    
    // Set video sources
    document.getElementById('videoASource').src = testData.videoA.videoUrl;
    document.getElementById('videoBSource').src = testData.videoB.videoUrl;
    
    // Reload videos
    document.getElementById('videoA').load();
    document.getElementById('videoB').load();
    
    // Set YouTube links
    document.getElementById('videoALink').href = testData.videoA.youtubeUrl;
    document.getElementById('videoBLink').href = testData.videoB.youtubeUrl;
    
    // Show comparison section
    comparisonSection.style.display = 'block';
    
    // Scroll to comparison
    comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Fetch and update YouTube stats
async function fetchAndUpdateStats() {
    try {
        const [statsA, statsB] = await Promise.all([
            fetchYouTubeStats(testData.videoA.youtubeId),
            fetchYouTubeStats(testData.videoB.youtubeId)
        ]);

        if (statsA.success) {
            updateStatsDisplay('A', statsA.stats);
        }

        if (statsB.success) {
            updateStatsDisplay('B', statsB.stats);
        }

        // Determine winner
        if (statsA.success && statsB.success) {
            determineWinner(statsA.stats, statsB.stats);
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Fetch YouTube stats for a video
async function fetchYouTubeStats(videoId) {
    try {
        const response = await fetch(`/api/youtube/stats/${videoId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Update stats display
function updateStatsDisplay(version, stats) {
    document.getElementById(`views${version}`).textContent = formatNumber(stats.viewCount || 0);
    document.getElementById(`likes${version}`).textContent = formatNumber(stats.likeCount || 0);
    document.getElementById(`comments${version}`).textContent = formatNumber(stats.commentCount || 0);
    document.getElementById(`duration${version}`).textContent = stats.duration || '-';
}

// Determine and display winner
function determineWinner(statsA, statsB) {
    const viewsA = parseInt(statsA.viewCount) || 0;
    const viewsB = parseInt(statsB.viewCount) || 0;
    const likesA = parseInt(statsA.likeCount) || 0;
    const likesB = parseInt(statsB.likeCount) || 0;

    // Calculate engagement score (views + likes * 10)
    const scoreA = viewsA + (likesA * 10);
    const scoreB = viewsB + (likesB * 10);

    const winnerSection = document.getElementById('winnerSection');
    const winnerContent = document.getElementById('winnerContent');

    if (scoreA === 0 && scoreB === 0) {
        winnerSection.style.display = 'none';
        return;
    }

    winnerSection.style.display = 'block';

    if (scoreA > scoreB) {
        winnerContent.innerHTML = `
            <div>🏆 Video A is leading!</div>
            <div style="margin-top: 10px; font-size: 0.95rem;">
                Engagement Score: ${formatNumber(scoreA)} vs ${formatNumber(scoreB)}
            </div>
        `;
        highlightWinner('A');
    } else if (scoreB > scoreA) {
        winnerContent.innerHTML = `
            <div>🏆 Video B is leading!</div>
            <div style="margin-top: 10px; font-size: 0.95rem;">
                Engagement Score: ${formatNumber(scoreB)} vs ${formatNumber(scoreA)}
            </div>
        `;
        highlightWinner('B');
    } else {
        winnerContent.innerHTML = `
            <div>🤝 It's a tie!</div>
            <div style="margin-top: 10px; font-size: 0.95rem;">
                Both videos have equal engagement
            </div>
        `;
    }
}

// Highlight winner stats
function highlightWinner(version) {
    // Remove all winner classes
    document.querySelectorAll('.stat-item').forEach(item => {
        item.classList.remove('winner');
    });

    // Add winner class to winning video's stats
    const statsGrid = document.getElementById(`stats${version}`);
    statsGrid.querySelectorAll('.stat-item').forEach(item => {
        item.classList.add('winner');
    });
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Refresh stats button
document.getElementById('refreshStatsBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshStatsBtn');
    const originalText = btn.textContent;
    
    btn.textContent = '⏳ Refreshing...';
    btn.disabled = true;
    
    await fetchAndUpdateStats();
    
    btn.textContent = originalText;
    btn.disabled = false;
});

// Initialize
checkApiHealth();
