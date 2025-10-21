const blackboxService = require('../services/blackbox');
const youtubeService = require('../services/youtube');

async function videoRoutes(fastify, options) {
  // Generate video endpoint
  fastify.post('/api/video/generate', async (request, reply) => {
    try {
      const { prompt, options } = request.body;

      if (!prompt) {
        return reply.code(400).send({
          success: false,
          error: 'Prompt is required'
        });
      }

      // Check if API is configured
      if (!blackboxService.isConfigured()) {
        return reply.code(500).send({
          success: false,
          error: 'Blackbox API is not configured. Please set BLACKBOX_API_KEY in .env file'
        });
      }

      // Generate video
      const result = await blackboxService.generateVideo(prompt, options);

      if (!result.success) {
        return reply.code(result.statusCode || 500).send(result);
      }

      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Get YouTube upload instructions
  fastify.post('/api/youtube/instructions', async (request, reply) => {
    try {
      const { videoUrl, metadata } = request.body;

      if (!videoUrl) {
        return reply.code(400).send({
          success: false,
          error: 'Video URL is required'
        });
      }

      const instructions = youtubeService.getUploadInstructions(videoUrl, metadata);
      return reply.send(instructions);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Upload video to YouTube (automatic with OAuth2)
  fastify.post('/api/youtube/upload', async (request, reply) => {
    try {
      const { videoUrl, metadata } = request.body;

      if (!videoUrl) {
        return reply.code(400).send({
          success: false,
          error: 'Video URL is required'
        });
      }

      if (!youtubeService.isConfigured()) {
        return reply.code(500).send({
          success: false,
          error: 'YouTube OAuth2 is not configured. Please set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env file'
        });
      }

      const result = await youtubeService.uploadVideo(videoUrl, metadata);
      return reply.send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Get YouTube OAuth2 authorization URL
  fastify.get('/api/youtube/auth-url', async (request, reply) => {
    try {
      if (!youtubeService.isConfigured()) {
        return reply.code(500).send({
          success: false,
          error: 'YouTube OAuth2 is not configured'
        });
      }

      const authUrl = youtubeService.getAuthUrl();
      return reply.send({
        success: true,
        authUrl
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // OAuth2 callback handler
  fastify.get('/auth/youtube/callback', async (request, reply) => {
    try {
      const { code } = request.query;

      if (!code) {
        return reply.code(400).send('Authorization code is required');
      }

      await youtubeService.getTokensFromCode(code);
      
      // Redirect to success page
      return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>YouTube Authentication Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #10b981;
              margin-bottom: 20px;
            }
            p {
              color: #555;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Authentication Successful!</h1>
            <p>
              Your YouTube account has been successfully connected.<br>
              You can now upload videos automatically to YouTube.
            </p>
            <a href="/" class="btn">Return to App</a>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      fastify.log.error(error);
      return reply.type('text/html').send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>YouTube Authentication Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #ef4444;
              margin-bottom: 20px;
            }
            p {
              color: #555;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✗ Authentication Failed</h1>
            <p>
              There was an error connecting your YouTube account.<br>
              Error: ${error.message}
            </p>
            <a href="/" class="btn">Return to App</a>
          </div>
        </body>
        </html>
      `);
    }
  });

  // Check YouTube authentication status
  fastify.get('/api/youtube/auth-status', async (request, reply) => {
    try {
      return reply.send({
        success: true,
        authenticated: youtubeService.isAuthenticated(),
        configured: youtubeService.isConfigured()
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Health check endpoint
  fastify.get('/api/health', async (request, reply) => {
    return {
      status: 'ok',
      apiConfigured: blackboxService.isConfigured(),
      youtubeConfigured: youtubeService.isConfigured(),
      youtubeAuthenticated: youtubeService.isAuthenticated(),
      timestamp: new Date().toISOString()
    };
  });
}

module.exports = videoRoutes;
