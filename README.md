# Blackbox Video Generator

A web application built with Node.js and Fastify that connects to the Blackbox API to generate videos from text prompts, with integrated YouTube upload support.

## Features

### Video Generation
- 🎬 Generate videos using AI-powered prompts
- 🎥 Direct video playback in browser with HTML5 player
- 📥 One-click video download
- 📋 Copy video link to clipboard
- 🌐 Clean and intuitive web interface

### YouTube Integration
- 📺 Upload to YouTube with guided instructions
- 📝 Pre-filled metadata (title, description, tags)
- 🔗 Direct links to YouTube Studio
- 📋 Easy copy of video URLs and metadata
- ✨ Beautiful modal interface

### Technical Features
- ⚡ Fast and lightweight Fastify backend
- 🔒 Secure API key management with environment variables
- 📊 Real-time API health monitoring
- 📱 Fully responsive design (mobile & desktop)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Blackbox API key

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API keys:**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```bash
   # Blackbox API (Required)
   BLACKBOX_API_KEY=your_blackbox_api_key_here
   BLACKBOX_API_URL=https://api.blackbox.ai/chat/completions
   BLACKBOX_MODEL=blackboxai/google/veo-2
   
   # YouTube API (Optional - for upload instructions)
   YOUTUBE_API_KEY=your_youtube_api_key_here
   
   # Server Configuration
   PORT=3000
   HOST=localhost
   ```
   
   **Note:** YouTube API key is optional. Without it, you can still generate and view videos, but the YouTube upload feature will be disabled.

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

3. **Generate and manage videos:**
   - Enter a descriptive prompt in the text area
   - Click "Generate Video"
   - Watch the video directly in the browser
   - Download the video or copy its link
   - Upload to YouTube with guided instructions

## Project Structure

```
blackbox-video-generator/
├── server.js                    # Main Fastify server
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── README.md                    # This file
├── YOUTUBE_SETUP.md            # YouTube integration guide
├── TODO.md                      # Implementation tracking
├── public/                      # Frontend files
│   ├── index.html              # Main UI
│   ├── styles.css              # Styling
│   └── app.js                  # Frontend logic
├── src/
│   ├── routes/
│   │   └── video.js            # API routes (video + YouTube)
│   └── services/
│       ├── blackbox.js         # Blackbox API integration
│       └── youtube.js          # YouTube service
└── temp/                        # Temporary video files (auto-created)
```

## API Endpoints

### Video Generation

#### POST `/api/video/generate`
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
    "url": "https://example.com/video.mp4",
    // Other Blackbox API response data
  }
}
```

### YouTube Integration

#### POST `/api/youtube/instructions`
Get step-by-step instructions for uploading a video to YouTube.

**Request Body:**
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "metadata": {
    "title": "My Video Title",
    "description": "Video description",
    "tags": ["tag1", "tag2"],
    "privacyStatus": "private"
  }
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://example.com/video.mp4",
  "metadata": {
    "title": "My Video Title",
    "description": "Video description",
    "tags": "tag1, tag2",
    "privacy": "private"
  },
  "instructions": [
    "1. Download the video from the link above",
    "2. Go to YouTube Studio...",
    // More steps...
  ]
}
```

#### POST `/api/youtube/upload`
Attempt to upload video to YouTube (requires OAuth2 - currently returns instructions).

### Health Check

#### GET `/api/health`
Check API health and configuration status.

**Response:**
```json
{
  "status": "ok",
  "apiConfigured": true,
  "youtubeConfigured": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## YouTube Upload Guide

The application provides guided instructions for uploading videos to YouTube. Here's how it works:

### Current Implementation (Manual Upload)
1. Generate a video using the Blackbox API
2. Click the "📺 Upload to YouTube" button
3. A modal appears with:
   - Pre-filled metadata (title, description, tags)
   - Step-by-step upload instructions
   - Video download link
   - Direct link to YouTube Studio
4. Follow the instructions to upload manually

### Why Manual Upload?
- **Simple**: No OAuth2 complexity
- **Secure**: No token management required
- **Immediate**: Works right away
- **Flexible**: Full control over upload process

### Future: Automatic Upload
For automatic uploads, OAuth2 authentication would be required. See `YOUTUBE_SETUP.md` for details on implementing this feature.

## Example Prompts

Try these prompts for video generation:

- "A tesla car moving on a highway at sunset"
- "A serene mountain landscape with a flowing river"
- "A futuristic city with flying cars at night"
- "An astronaut floating in space with Earth in the background"
- "A cozy coffee shop on a rainy day with people reading"
- "A time-lapse of flowers blooming in a garden"

## Troubleshooting

### Blackbox API Issues

**API Key Not Configured**
- Make sure you created the `.env` file
- Verify your Blackbox API key is correct
- Restart the server after updating `.env`

**Connection Issues**
- Check that the Blackbox API URL is correct
- Verify your internet connection
- Ensure your API key has the necessary permissions

**Video Not Displaying**
- Check browser console for errors
- Verify the video URL is accessible
- Try a different browser

### YouTube Integration Issues

**YouTube Button Not Working**
- Ensure `YOUTUBE_API_KEY` is set in `.env` (optional)
- Check browser console for errors
- Verify the video was generated successfully

**Modal Not Appearing**
- Check for JavaScript errors in browser console
- Ensure popup blockers are not interfering
- Try refreshing the page

**Upload Instructions Not Clear**
- See `YOUTUBE_SETUP.md` for detailed guide
- Visit [YouTube Studio](https://studio.youtube.com) for help
- Check YouTube's upload requirements

## Dependencies

- **fastify**: Fast web framework
- **@fastify/static**: Static file serving
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **googleapis**: YouTube API integration
- **form-data**: Multipart form data handling

## Documentation

- `README.md` - This file (main documentation)
- `YOUTUBE_SETUP.md` - Detailed YouTube integration guide
- `TODO.md` - Implementation tracking and features
- `API_CONFIGURATION.md` - Blackbox API configuration details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
