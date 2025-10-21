# Google Cloud OAuth2 Setup Guide for YouTube Upload

Follow these steps to create OAuth2 credentials for automatic YouTube uploads.

## Step 1: Enable YouTube Data API v3

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (takes a few seconds)

## Step 2: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**

### Fill in the required fields:

**App Information:**
- **App name**: `Blackbox Video Generator` (or any name you prefer)
- **User support email**: Your email address
- **App logo**: (Optional - skip for now)

**App Domain:**
- **Application home page**: `http://localhost:3000` (or leave blank)
- **Application privacy policy link**: (Optional - leave blank for testing)
- **Application terms of service link**: (Optional - leave blank for testing)

**Developer Contact Information:**
- **Email addresses**: Your email address

4. Click **"Save and Continue"**

### Add Scopes:

5. Click **"Add or Remove Scopes"**
6. Search for and select these scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube`
7. Click **"Update"**
8. Click **"Save and Continue"**

### Add Test Users:

9. Click **"Add Users"**
10. Add your Gmail/YouTube account email
11. Click **"Add"**
12. Click **"Save and Continue"**
13. Review and click **"Back to Dashboard"**

## Step 3: Create OAuth2 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**

### Configure the OAuth Client:

**Name:**
- Enter: `Blackbox Video Generator Web Client`

**Authorized JavaScript origins:**
- Click **"Add URI"**
- Add: `http://localhost:3000`

**Authorized redirect URIs:**
- Click **"Add URI"**
- Add: `http://localhost:3000/auth/youtube/callback`

4. Click **"Create"**

## Step 4: Download Credentials

1. A popup will appear with your credentials
2. **Copy these values** (you'll need them):
   - **Client ID**: (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret**: (looks like: `GOCSPX-xxxxx`)

3. Click **"Download JSON"** (optional - for backup)
4. Click **"OK"**

## Step 5: Add to .env File

Open your `.env` file and add these lines:

```bash
# YouTube OAuth2 Credentials
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback
```

Replace:
- `your_client_id_here` with your actual Client ID
- `your_client_secret_here` with your actual Client Secret

## Your .env File Should Look Like:

```bash
# Blackbox API
BLACKBOX_API_KEY=your_blackbox_key
BLACKBOX_API_URL=https://api.blackbox.ai/chat/completions
BLACKBOX_MODEL=blackboxai/google/veo-2

# YouTube OAuth2
YOUTUBE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-your_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback

# Server
PORT=3000
HOST=localhost
```

## Next Steps

Once you've added the credentials to your `.env` file:

1. Let me know you're done
2. I'll implement the automatic upload feature
3. You'll authenticate once with your YouTube account
4. Then automatic uploads will work!

## Important Notes

- **Test Users**: During development, only test users you added can authenticate
- **Publishing**: To allow anyone to use it, you'll need to publish the app (requires verification)
- **Quotas**: YouTube API has daily quotas (10,000 units/day, ~6 video uploads)

## Troubleshooting

**"Access blocked: This app's request is invalid"**
- Make sure you added your email as a test user
- Check that redirect URI matches exactly: `http://localhost:3000/auth/youtube/callback`

**"OAuth consent screen not configured"**
- Complete Step 2 above
- Make sure you saved all sections

**"API not enabled"**
- Go back to Step 1 and enable YouTube Data API v3

---

**Ready?** Once you have your Client ID and Client Secret in the `.env` file, let me know and I'll implement the automatic upload!
