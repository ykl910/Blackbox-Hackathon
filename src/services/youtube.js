const { google } = require('googleapis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

class YouTubeService {
  constructor() {
    this.clientId = process.env.YOUTUBE_CLIENT_ID;
    this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    this.redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/auth/youtube/callback';
    
    // Initialize OAuth2 client
    if (this.clientId && this.clientSecret) {
      this.oauth2Client = new google.auth.OAuth2(
        this.clientId,
        this.clientSecret,
        this.redirectUri
      );
      
      // Load saved tokens if they exist
      this.loadTokens();
    }

    this.tokens = null;
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthUrl() {
    if (!this.oauth2Client) {
      throw new Error('YouTube OAuth2 not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code) {
    if (!this.oauth2Client) {
      throw new Error('YouTube OAuth2 not configured');
    }

    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.tokens = tokens;
    
    // Save tokens to file for persistence
    this.saveTokens(tokens);
    
    return tokens;
  }

  /**
   * Save tokens to file
   */
  saveTokens(tokens) {
    try {
      const tokenPath = path.join(__dirname, '../../.youtube-tokens.json');
      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
      console.log('YouTube tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  /**
   * Load tokens from file
   */
  loadTokens() {
    try {
      const tokenPath = path.join(__dirname, '../../.youtube-tokens.json');
      if (fs.existsSync(tokenPath)) {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        this.tokens = tokens;
        if (this.oauth2Client) {
          this.oauth2Client.setCredentials(tokens);
        }
        console.log('YouTube tokens loaded successfully');
        return tokens;
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    if (!this.tokens) {
      this.loadTokens();
    }
    return !!this.tokens;
  }

  /**
   * Check if YouTube API is configured
   */
  isConfigured() {
    return !!(this.clientId && this.clientSecret);
  }

  /**
   * Download video from URL to temporary file
   */
  async downloadVideo(videoUrl) {
    try {
      const tempDir = path.join(__dirname, '../../temp');
      
      // Create temp directory if it doesn't exist
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const fileName = `video_${Date.now()}.mp4`;
      const filePath = path.join(tempDir, fileName);
      
      // Download video
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      await pipeline(response.data, writer);

      return filePath;
    } catch (error) {
      console.error('Error downloading video:', error.message);
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }

  /**
   * Upload video to YouTube automatically
   */
  async uploadVideo(videoUrl, metadata = {}) {
    try {
      if (!this.isConfigured()) {
        throw new Error('YouTube OAuth2 not configured');
      }

      if (!this.isAuthenticated()) {
        return {
          success: false,
          error: 'Not authenticated',
          authRequired: true,
          authUrl: this.getAuthUrl(),
          message: 'Please authenticate with YouTube first'
        };
      }

      // Download video first
      console.log('Downloading video from:', videoUrl);
      const videoPath = await this.downloadVideo(videoUrl);

      // Prepare metadata
      const title = metadata.title || 'Generated Video';
      const description = metadata.description || 'Video generated using Blackbox AI';
      const tags = metadata.tags || ['AI', 'Generated', 'Blackbox'];
      const privacyStatus = metadata.privacyStatus || 'private';

      // Initialize YouTube API
      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
      });

      console.log('Uploading to YouTube...');

      // Upload video
      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title,
            description,
            tags,
            categoryId: '22' // People & Blogs category
          },
          status: {
            privacyStatus
          }
        },
        media: {
          body: fs.createReadStream(videoPath)
        }
      });

      // Clean up temp file
      await this.cleanupTempFile(videoPath);

      console.log('Video uploaded successfully!');

      return {
        success: true,
        videoId: response.data.id,
        videoUrl: `https://www.youtube.com/watch?v=${response.data.id}`,
        title: response.data.snippet.title,
        message: 'Video uploaded successfully to YouTube!'
      };

    } catch (error) {
      console.error('YouTube upload error:', error);
      
      if (error.message.includes('Not authenticated')) {
        return {
          success: false,
          error: 'Not authenticated',
          authRequired: true,
          authUrl: this.getAuthUrl(),
          message: 'Please authenticate with YouTube first'
        };
      }

      return {
        success: false,
        error: error.message,
        message: 'Failed to upload video to YouTube'
      };
    }
  }

  /**
   * Get video statistics from YouTube
   */
  async getVideoStats(videoId) {
    try {
      if (!this.isConfigured()) {
        throw new Error('YouTube OAuth2 not configured');
      }

      if (!this.isAuthenticated()) {
        return {
          success: false,
          error: 'Not authenticated',
          authRequired: true,
          message: 'Please authenticate with YouTube first'
        };
      }

      // Initialize YouTube API
      const youtube = google.youtube({
        version: 'v3',
        auth: this.oauth2Client
      });

      // Fetch video statistics
      const response = await youtube.videos.list({
        part: ['statistics', 'contentDetails', 'snippet'],
        id: [videoId]
      });

      if (!response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          error: 'Video not found'
        };
      }

      const video = response.data.items[0];
      const stats = video.statistics;
      const contentDetails = video.contentDetails;
      const snippet = video.snippet;

      return {
        success: true,
        stats: {
          viewCount: stats.viewCount || '0',
          likeCount: stats.likeCount || '0',
          commentCount: stats.commentCount || '0',
          duration: this.formatDuration(contentDetails.duration),
          publishedAt: snippet.publishedAt,
          title: snippet.title
        }
      };
    } catch (error) {
      console.error('Error fetching video stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format ISO 8601 duration to readable format
   */
  formatDuration(duration) {
    try {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      
      const hours = (match[1] || '').replace('H', '');
      const minutes = (match[2] || '').replace('M', '');
      const seconds = (match[3] || '').replace('S', '');

      const parts = [];
      if (hours) parts.push(`${hours}h`);
      if (minutes) parts.push(`${minutes}m`);
      if (seconds) parts.push(`${seconds}s`);

      return parts.join(' ') || '0s';
    } catch (error) {
      return duration;
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Cleaned up temp file:', filePath);
      }
    } catch (error) {
      console.error('Error cleaning up temp file:', error.message);
    }
  }
}

module.exports = new YouTubeService();
