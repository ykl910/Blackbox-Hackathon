# 🚀 Quick Setup Guide

## Step 1: Configure Your API Key

You need to create a `.env` file with your Blackbox API key. Here's how:

### Option A: Using the command line
```bash
echo "BLACKBOX_API_KEY=your_api_key_here" > .env
echo "BLACKBOX_API_URL=https://api.blackbox.ai/api/video" >> .env
echo "PORT=3000" >> .env
echo "HOST=localhost" >> .env
```

### Option B: Manual creation
1. Create a new file named `.env` in the project root
2. Add the following content (replace `your_api_key_here` with your actual API key):

```
BLACKBOX_API_KEY=your_api_key_here
BLACKBOX_API_URL=https://api.blackbox.ai/api/video
PORT=3000
HOST=localhost
```

## Step 2: Start the Application

```bash
npm start
```

You should see:
```
🚀 Blackbox Video Generator is running!
📍 Server: http://localhost:3000
🔑 API Key configured: Yes ✓
```

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## Step 4: Generate Your First Video

1. Enter a descriptive prompt (e.g., "A peaceful beach at sunset with waves")
2. Click "Generate Video"
3. View the API response

---

## ⚠️ Important Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- The `.env` file must be in the root directory of the project
- Restart the server after changing the `.env` file
- Make sure your API key has the necessary permissions

## 🔧 Troubleshooting

### "API Key Not Configured" Warning
- Check that `.env` file exists in the root directory
- Verify the API key is correctly set (no extra spaces)
- Restart the server

### Port Already in Use
Change the PORT in your `.env` file:
```
PORT=3001
```

### API Connection Issues
- Verify the BLACKBOX_API_URL is correct
- Check your internet connection
- Confirm your API key is valid and active

---

## 📝 Example Prompts to Try

- "A futuristic city with flying cars at night"
- "A serene forest with sunlight filtering through trees"
- "An astronaut floating in space with Earth in the background"
- "A cozy coffee shop on a rainy day"

Enjoy creating videos! 🎬
