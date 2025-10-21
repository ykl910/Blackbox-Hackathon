# Blackbox API Configuration Guide

## ✅ Correct API Endpoint Configured

The application is now configured with the correct Blackbox API endpoint based on the official documentation.

## API Details

**Endpoint:** `https://api.blackbox.ai/chat/completions`  
**Model:** `blackboxai/google/veo-2`  
**Method:** POST

## Request Format

The application sends requests in this format (as per Blackbox API documentation):

```json
{
  "model": "blackboxai/google/veo-2",
  "messages": [
    {
      "role": "user",
      "content": "Your video description here"
    }
  ]
}
```

With headers:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Configuration in .env

Your `.env` file should look like this:

```bash
# Blackbox API Configuration
BLACKBOX_API_KEY=your_actual_api_key_here
BLACKBOX_API_URL=https://api.blackbox.ai/chat/completions
BLACKBOX_MODEL=blackboxai/google/veo-2

# Server Configuration
PORT=3000
HOST=localhost
```

## Setup Steps

1. **Add Your API Key:**
   - Open the `.env` file
   - Replace `your_api_key_here` with your actual Blackbox API key

2. **Restart the Server:**
   - Stop the current server (Ctrl+C if running)
   - Start it again: `npm start`

3. **Test Video Generation:**
   - Open http://localhost:3000
   - Enter a prompt like: "tesla car moving on a highway"
   - Click "Generate Video"

## Example Prompts

Try these prompts for video generation:

- "tesla car moving on a highway"
- "A serene sunset over mountains with birds flying"
- "A futuristic city with flying cars at night"
- "An astronaut floating in space with Earth in the background"
- "A cozy coffee shop on a rainy day"

## Troubleshooting

### 401 Unauthorized
- **Cause:** Invalid or missing API key
- **Solution:** Verify your API key in `.env` is correct

### 403 Forbidden
- **Cause:** API key doesn't have video generation permissions
- **Solution:** Check your Blackbox account permissions

### 500 Internal Server Error
- **Cause:** Issue with the API request format or server-side error
- **Solution:** Check the server logs for details

### Timeout
- **Cause:** Video generation takes longer than 120 seconds
- **Solution:** The timeout is set to 120 seconds, which should be sufficient for most videos

## Response Format

Successful responses will include the video generation data from Blackbox API. The exact format depends on the API response, but typically includes:

```json
{
  "success": true,
  "data": {
    // Blackbox API response with video details
  }
}
```

## Need Help?

1. Check the [Blackbox API Documentation](https://docs.blackbox.ai/api-reference/video)
2. Verify your API key is active in your Blackbox dashboard
3. Check server logs for detailed error messages
4. Ensure you have sufficient API credits/quota

---

**Note:** The API endpoint and request format are now correctly configured according to the official Blackbox API documentation.
