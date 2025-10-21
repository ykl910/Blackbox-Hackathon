const blackboxService = require('../services/blackbox');

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

  // Health check endpoint
  fastify.get('/api/health', async (request, reply) => {
    return {
      status: 'ok',
      apiConfigured: blackboxService.isConfigured(),
      timestamp: new Date().toISOString()
    };
  });
}

module.exports = videoRoutes;
