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
- 📺 **Automatic YouTube Upload** with OAuth2 authentication
- 🔐 Secure OAuth2 flow with token persistence
- 📝 Pre-filled metadata (title, description, tags)
- 🎯 One-click upload after authentication
- 🔗 Direct links to uploaded videos

### A/B Testing (NEW!)
- 📊 **Generate two videos with the same prompt**
- 🔄 **Compare live YouTube statistics**
- 📈 Track views, likes, comments in real-time
- 🏆 Automatic winner detection based on engagement
- ⚡ Parallel video generation and upload
- 📱 Side-by-side comparison view

### Technical Features
- ⚡ Fast and lightweight Fastify backend
- 🔒 Secure API key management with environment variables
- 📊 Real-time API health monitoring
- 📱 Fully responsive design (mobile & desktop)
- 🔐 OAuth2 authentication with Google

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
   
   # YouTube OAuth2 (Required for automatic upload and A/B testing)
   YOUTUBE_CLIENT_ID=your_client_id_here
   YOUTUBE_CLIENT_SECRET=your_client_secret_here
   YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback
   
   # Server Configuration
   PORT=3000
   HOST=localhost
   ```
   
   **Note:** YouTube OAuth2 credentials are required for automatic upload and A/B testing features. See `OAUTH2_SETUP_GUIDE.md` for setup instructions.

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
   - Upload to YouTube automatically with one click

4. **A/B Testing (Optional):**
   - Navigate to the A/B Testing page
   - Enter a prompt to generate two videos
   - Both videos upload automatically to YouTube
   - Compare live statistics and engagement
   - See which video performs better

## Project Structure

```
blackbox-video-generator/
├── server.js                    # Main Fastify server
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── README.md                    # This file
├── OAUTH2_SETUP_GUIDE.md       # OAuth2 setup instructions
├── AUTOMATIC_UPLOAD_GUIDE.md   # Automatic upload guide
├── AB_TESTING_GUIDE.md         # A/B testing guide
├── YOUTUBE_SETUP.md            # YouTube integration guide
├── TODO.md                      # Implementation tracking
├── public/                      # Frontend files
│   ├── index.html              # Main UI
│   ├── app.js                  # Frontend logic
│   ├── styles.css              # Styling
│   ├── ab-test.html            # A/B testing page
│   ├── ab-test.js              # A/B testing logic
│   └── ab-test.css             # A/B testing styles
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

#### POST `/api/youtube/upload`
Automatically upload a video to YouTube (requires OAuth2 authentication).

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
  "videoId": "abc123xyz",
  "videoUrl": "https://www.youtube.com/watch?v=abc123xyz",
  "title": "My Video Title",
  "message": "Video uploaded successfully to YouTube!"
}
```

#### GET `/api/youtube/auth-url`
Get OAuth2 authorization URL for YouTube authentication.

#### GET `/auth/youtube/callback`
OAuth2 callback endpoint (handles authentication).

#### GET `/api/youtube/auth-status`
Check YouTube authentication status.

#### GET `/api/youtube/stats/:videoId`
Get live statistics for a YouTube video.

**Response:**
```json
{
  "success": true,
  "stats": {
    "viewCount": "1234",
    "likeCount": "56",
    "commentCount": "12",
    "duration": "2m 30s",
    "publishedAt": "2024-01-01T00:00:00Z",
    "title": "Video Title"
  }
}
```

### Health Check

#### GET `/api/health`
Check API health and configuration status.

**Response:**
```json
{
  "status": "ok",
  "apiConfigured": true,
  "youtubeConfigured": true,
  "youtubeAuthenticated": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## YouTube Automatic Upload

The application now supports automatic YouTube uploads with OAuth2 authentication:

### Setup
1. Create OAuth2 credentials in Google Cloud Console
2. Add credentials to `.env` file
3. Enable YouTube Data API v3
4. See `OAUTH2_SETUP_GUIDE.md` for detailed setup

### How It Works
1. Generate a video using the Blackbox API
2. Click "📺 Upload to YouTube"
3. First time: Authenticate with Google (popup window)
4. After authentication: One-click automatic upload
5. Video opens in YouTube automatically

### Features
- ✅ Secure OAuth2 authentication
- ✅ Token persistence (no re-auth needed)
- ✅ Automatic video download and upload
- ✅ Pre-filled metadata
- ✅ Direct link to uploaded video

See `AUTOMATIC_UPLOAD_GUIDE.md` for detailed usage instructions.

## A/B Testing Feature

Compare two AI-generated videos with the same prompt and track their YouTube performance:

### How to Use
1. Navigate to the A/B Testing page (`/ab-test.html`)
2. Enter a prompt (same for both videos)
3. Click "Generate & Upload Both Videos"
4. Wait for parallel generation and upload
5. View side-by-side comparison with live stats
6. Click "Refresh Stats" to update metrics

### What's Compared
- **Views**: Total video views
- **Likes**: Number of likes
- **Comments**: Comment count
- **Duration**: Video length
- **Engagement Score**: Views + (Likes × 10)

### Use Cases
- Test prompt variations
- Compare video quality
- Optimize content strategy
- Make data-driven decisions

See `AB_TESTING_GUIDE.md` for detailed instructions.

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
- `OAUTH2_SETUP_GUIDE.md` - OAuth2 setup for YouTube
- `AUTOMATIC_UPLOAD_GUIDE.md` - Automatic upload guide
- `AB_TESTING_GUIDE.md` - A/B testing feature guide
- `YOUTUBE_SETUP.md` - YouTube integration overview
- `TODO.md` - Implementation tracking
- `API_CONFIGURATION.md` - Blackbox API configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
