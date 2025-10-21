# Automatic YouTube Upload - Quick Start Guide

## ✅ Implementation Complete!

Your Blackbox Video Generator now supports **automatic YouTube uploads** using OAuth2 authentication.

## 🚀 How to Use

### 1. First Time Setup (One-time)

You've already added your OAuth2 credentials to `.env`:
```bash
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback
```

### 2. Using the App

1. **Start the server** (already running):
   ```bash
   npm start
   ```

2. **Open the app** in your browser:
   ```
   http://localhost:3000
   ```

3. **Generate a video**:
   - Enter a prompt (e.g., "A serene sunset over mountains")
   - Click "Generate Video"
   - Wait for the video to appear

4. **Upload to YouTube** (First time):
   - Click the "📺 Upload to YouTube" button
   - A popup will open asking you to authenticate
   - Sign in with your YouTube/Google account
   - Grant permissions to the app
   - Close the popup
   - Click "📺 Upload to YouTube" again
   - Video will upload automatically!

5. **Upload to YouTube** (After authentication):
   - Just click "📺 Upload to YouTube"
   - Video uploads automatically
   - Opens in YouTube when done!

## 🎯 Features

### Automatic Upload
- ✅ One-click upload after authentication
- ✅ Automatic video download and upload
- ✅ Pre-filled metadata (title, description, tags)
- ✅ Opens YouTube video after upload
- ✅ Private by default (you can change to public later)

### Authentication
- ✅ Secure OAuth2 flow
- ✅ Tokens saved automatically
- ✅ No need to re-authenticate each time
- ✅ Works across browser sessions

### Video Metadata
Each uploaded video includes:
- **Title**: "AI Generated Video - [Date]"
- **Description**: "Video generated using Blackbox AI Video Generator"
- **Tags**: AI Generated, Blackbox AI, Video Generation
- **Privacy**: Private (change in YouTube Studio if needed)

## 🔧 How It Works

### Authentication Flow
1. Click "Upload to YouTube" → Checks if authenticated
2. If not authenticated → Opens Google OAuth2 popup
3. User signs in and grants permissions
4. Tokens saved to `.youtube-tokens.json`
5. User clicks "Upload to YouTube" again
6. Video uploads automatically!

### Upload Process
1. Checks authentication status
2. Downloads video from URL
3. Uploads to YouTube with metadata
4. Cleans up temporary files
5. Opens YouTube video in new tab

## 📝 Important Notes

### Privacy Settings
- Videos are uploaded as **Private** by default
- You can change to Public/Unlisted in YouTube Studio
- This prevents accidental public uploads

### Test Users
- During development, only test users can authenticate
- Make sure your email is added as a test user in Google Cloud Console
- To allow anyone: Publish the app (requires verification)

### Quotas
- YouTube API has daily quotas
- Default: 10,000 units/day
- Each upload costs ~1,600 units
- You can upload ~6 videos per day

### Token Storage
- Tokens saved in `.youtube-tokens.json`
- File is gitignored (not committed to repo)
- Tokens persist across server restarts
- Delete file to force re-authentication

## 🐛 Troubleshooting

### "YouTube OAuth2 is not configured"
- Check `.env` file has `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET`
- Restart the server after adding credentials

### "Authentication required"
- Click the button again to open auth popup
- Complete authentication in popup
- Close popup and try again

### "Access blocked: This app's request is invalid"
- Make sure your email is added as test user in Google Cloud Console
- Check redirect URI matches: `http://localhost:3000/auth/youtube/callback`

### Upload fails after authentication
- Check server logs for errors
- Verify YouTube Data API v3 is enabled
- Check API quotas in Google Cloud Console

### Popup blocked
- Allow popups for localhost:3000
- Or manually copy auth URL and open in new tab

## 🎉 Success!

Once authenticated, you can:
- ✅ Upload videos with one click
- ✅ No manual steps required
- ✅ Automatic metadata
- ✅ Direct link to YouTube video

## 📚 Additional Resources

- **OAuth2 Setup**: See `OAUTH2_SETUP_GUIDE.md`
- **API Documentation**: See `README.md`
- **Troubleshooting**: Check server logs

---

**Ready to upload?** Open http://localhost:3000 and start generating videos!
