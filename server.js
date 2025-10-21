require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const path = require('path');

// Register static file serving
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/'
});

// Register routes
fastify.register(require('./src/routes/video'));

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || 'localhost';

    await fastify.listen({ port, host });
    
    console.log('\n🚀 Blackbox Video Generator is running!');
    console.log(`📍 Server: http://${host}:${port}`);
    console.log(`🔑 API Key configured: ${process.env.BLACKBOX_API_KEY ? 'Yes ✓' : 'No ✗'}`);
    
    if (!process.env.BLACKBOX_API_KEY) {
      console.log('\n⚠️  Warning: BLACKBOX_API_KEY not found!');
      console.log('   Please create a .env file with your API key.');
      console.log('   See .env.example for reference.\n');
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
