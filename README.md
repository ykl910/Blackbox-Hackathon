# Blackbox Video Generator

A web application built with Node.js and Fastify that connects to the Blackbox API to generate videos from text prompts.

## Features

- 🎬 Generate videos using AI-powered prompts
- 🌐 Clean and intuitive web interface
- ⚡ Fast and lightweight Fastify backend
- 🔒 Secure API key management with environment variables
- 📊 Real-time API health monitoring

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Blackbox API key

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API key:**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Blackbox API key:
   ```
   BLACKBOX_API_KEY=your_actual_api_key_here
   BLACKBOX_API_URL=https://api.blackbox.ai/api/video
   PORT=3000
   HOST=localhost
   ```

## Usage

1. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   
   Navigate to `http://localhost:3000`

3. **Generate videos:**
   - Enter a descriptive prompt in the text area
   - Click "Generate Video"
   - View the API response with video generation details

## Project Structure

```
blackbox-video-generator/
├── server.js                 # Main Fastify server
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (create this)
├── .env.example              # Environment template
├── public/                   # Frontend files
│   ├── index.html           # Main UI
│   ├── styles.css           # Styling
│   └── app.js               # Frontend logic
└── src/
    ├── routes/
    │   └── video.js         # API routes
    └── services/
        └── blackbox.js      # Blackbox API integration
```

## API Endpoints

### POST `/api/video/generate`
Generate a video from a text prompt.

**Request Body:**
```json
{
  "prompt": "A serene sunset over mountains",
  "options": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Blackbox API response data
  }
}
```

### GET `/api/health`
Check API health and configuration status.

**Response:**
```json
{
  "status": "ok",
  "apiConfigured": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### API Key Not Configured
If you see a warning about the API key:
1. Make sure you created the `.env` file
2. Verify your API key is correct
3. Restart the server after updating `.env`

### Connection Issues
- Check that the Blackbox API URL is correct
- Verify your internet connection
- Ensure your API key has the necessary permissions

## License

ISC
