# YouTube Integration Setup Guide

This guide explains how to set up YouTube integration for your Blackbox Video Generator.

## Important Note

**YouTube API requires OAuth2 authentication for video uploads.** A simple API key alone cannot upload videos directly. This implementation provides:

1. ✅ **Upload Instructions** - Guided steps to manually upload videos to YouTube
2. ✅ **Metadata Suggestions** - Pre-filled title, description, tags, and privacy settings
3. ✅ **Quick Access** - Direct links to download video and open YouTube Studio

## Current Implementation

### What Works Now:
- 📺 **YouTube Upload Button** - Click to get upload instructions
- 📋 **Suggested Metadata** - Pre-filled video information
- 📥 **Quick Download** - Download video directly from the modal
- 🔗 **YouTube Studio Link** - Opens YouTube Studio in a new tab
- 📝 **Step-by-Step Instructions** - Clear guide for manual upload

### How to Use:

1. **Generate a Video**
   - Enter your prompt and click "Generate Video"
   - Wait for the video to be generated

2. **Upload to YouTube**
   - Click the "📺 Upload to YouTube" button
   - A modal will appear with:
     - Suggested metadata (title, description, tags, privacy)
     - Step-by-step upload instructions
     - Video download link
     - Direct link to YouTube Studio

3. **Follow the Instructions**
   - Download the video using the provided link
   - Open YouTube Studio
   - Upload the video manually
   - Use the suggested metadata

## Setup (Optional - For Future OAuth2 Implementation)

If you want to implement automatic uploads in the future, you'll need:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

### 2. Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure the OAuth consent screen if prompted
4. Choose "Web application" as the application type
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/youtube/callback`
   - Add your production URL if deploying
6. Download the credentials JSON file

### 3. Update Environment Variables

Add to your `.env` file:

```bash
# YouTube API Configuration (Current - for instructions only)
YOUTUBE_API_KEY=your_youtube_api_key_here

# YouTube OAuth2 (Future implementation)
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback
```

### 4. Implement OAuth2 Flow (Future Enhancement)

To enable automatic uploads, you would need to:

1. Implement OAuth2 authentication flow
2. Store and refresh access tokens
3. Update the `youtube.js` service to use OAuth2
4. Add user authentication to the application

## API Quotas

YouTube Data API has daily quotas:
- **Default quota**: 10,000 units per day
- **Video upload cost**: ~1,600 units per upload
- **You can upload ~6 videos per day** with the default quota

To increase quota:
1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Quotas"
3. Request a quota increase (requires justification)

## Limitations

### Current Limitations:
- ❌ Cannot upload videos automatically (requires OAuth2)
- ✅ Provides guided manual upload process
- ✅ Suggests metadata for easy copying

### OAuth2 Requirements for Automatic Upload:
- User must authenticate with Google account
- Application must store and manage access tokens
- Tokens must be refreshed periodically
- More complex setup and maintenance

## Alternative: Manual Upload Process

The current implementation is designed to make manual uploads as easy as possible:

1. **One-Click Instructions** - Get all upload details instantly
2. **Pre-filled Metadata** - Copy suggested title, description, tags
3. **Quick Access** - Direct links to download and YouTube Studio
4. **No Authentication Required** - No need to manage OAuth tokens

This approach is:
- ✅ Simpler to use
- ✅ No authentication complexity
- ✅ No token management
- ✅ Works immediately
- ✅ No quota concerns for the application

## Future Enhancements

If you want to implement automatic uploads:

1. **Add OAuth2 Authentication**
   - Implement Google OAuth2 flow
   - Store user tokens securely
   - Handle token refresh

2. **Update YouTube Service**
   - Modify `src/services/youtube.js` to use OAuth2
   - Implement actual video upload
   - Add progress tracking

3. **Add User Management**
   - Store user credentials
   - Manage multiple YouTube accounts
   - Handle authentication errors

4. **Implement Upload Queue**
   - Queue videos for upload
   - Retry failed uploads
   - Track upload status

## Troubleshooting

### "YouTube API is not configured"
- **Solution**: Add `YOUTUBE_API_KEY` to your `.env` file

### "Failed to get upload instructions"
- **Solution**: Check server logs for errors
- Verify the video URL is valid

### Manual Upload Issues
- Ensure you're logged into the correct YouTube account
- Check that your account can upload videos
- Verify video file format is supported (MP4 recommended)

## Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [OAuth2 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [YouTube API Quotas](https://developers.google.com/youtube/v3/getting-started#quota)
- [YouTube Studio](https://studio.youtube.com)

## Support

For issues or questions:
1. Check the server logs for detailed error messages
2. Verify your API credentials are correct
3. Ensure the video URL is accessible
4. Review the YouTube API documentation

---

**Note**: The current implementation focuses on providing a smooth manual upload experience. Automatic uploads would require significant additional complexity with OAuth2 authentication.
