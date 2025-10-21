const axios = require('axios');

class BlackboxService {
  constructor() {
    this.apiKey = process.env.BLACKBOX_API_KEY;
    this.apiUrl = process.env.BLACKBOX_API_URL || 'https://api.blackbox.ai/chat/completions';
    this.model = process.env.BLACKBOX_MODEL || 'blackboxai/google/veo-2';
  }

  /**
   * Generate a video using the Blackbox API
   * @param {string} prompt - The prompt for video generation
   * @param {object} options - Additional options for video generation
   * @returns {Promise<object>} - The API response
   */
  async generateVideo(prompt, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('Blackbox API key is not configured');
      }

      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt is required');
      }

      // Format request according to Blackbox API documentation
      const requestData = {
        model: options.model || this.model,
        messages: [
          {
            role: 'user',
            content: prompt.trim()
          }
        ]
      };

      const response = await axios.post(this.apiUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 120 second timeout for video generation
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Blackbox API Error:', error.message);
      
      if (error.response) {
        // API responded with error
        const errorMessage = error.response.data?.error?.message 
          || error.response.data?.message 
          || 'API request failed';
        
        return {
          success: false,
          error: errorMessage,
          statusCode: error.response.status,
          details: error.response.data
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          error: 'No response from Blackbox API. Please check your connection.'
        };
      } else {
        // Other errors
        return {
          success: false,
          error: error.message
        };
      }
    }
  }

  /**
   * Check if the API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }
}

module.exports = new BlackboxService();
