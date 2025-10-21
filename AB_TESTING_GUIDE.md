# A/B Testing Guide

## Overview

The A/B Testing feature allows you to generate two videos with the same prompt and compare their performance on YouTube with live statistics.

## Features

✅ **Parallel Video Generation** - Generate two videos simultaneously with the same prompt
✅ **Automatic YouTube Upload** - Both videos are automatically uploaded to YouTube
✅ **Live Stats Tracking** - Real-time YouTube statistics (views, likes, comments)
✅ **Side-by-Side Comparison** - Visual comparison of both videos and their stats
✅ **Winner Detection** - Automatic calculation of which video is performing better
✅ **Engagement Score** - Combined metric based on views and likes

## How to Use

### 1. Access A/B Testing Page

- Open your browser to `http://localhost:3000`
- Click on "📊 A/B Testing →" in the header
- Or navigate directly to `http://localhost:3000/ab-test.html`

### 2. Configure Your Test

**Video Prompt:**
- Enter the same prompt that will be used for both videos
- Be descriptive and specific for best results
- Example: "A serene sunset over mountains with birds flying"

**Video Title Template:**
- Enter a base title for your videos
- Videos will be titled: "Video A: [your title]" and "Video B: [your title]"
- Default: "A/B Test Video"

### 3. Generate and Upload

1. Click "🎬 Generate & Upload Both Videos"
2. Wait for both videos to generate (this happens in parallel)
3. Both videos will automatically upload to YouTube
4. Progress is shown for each video:
   - ⏳ Generating...
   - 📤 Uploading to YouTube...
   - ✓ Complete

### 4. View Comparison

Once both videos are uploaded, you'll see:

**Video Players:**
- Side-by-side video players for both videos
- Direct links to view on YouTube

**Statistics:**
- **Views** - Total number of views
- **Likes** - Number of likes received
- **Comments** - Number of comments
- **Duration** - Video length

**Winner Section:**
- Shows which video is currently leading
- Engagement Score = Views + (Likes × 10)
- Updates when you refresh stats

### 5. Refresh Stats

- Click "🔄 Refresh Stats" to get the latest YouTube statistics
- Stats are fetched in real-time from YouTube API
- Compare performance over time

## Understanding the Metrics

### Engagement Score
The winner is determined by an engagement score:
```
Engagement Score = Views + (Likes × 10)
```

This gives more weight to likes since they indicate stronger engagement than passive views.

### Statistics Explained

- **Views**: Total number of times the video has been viewed
- **Likes**: Number of users who liked the video
- **Comments**: Number of comments on the video
- **Duration**: Length of the video in hours, minutes, and seconds

## Requirements

### Before Using A/B Testing

1. **Blackbox API Key** must be configured
   - Set `BLACKBOX_API_KEY` in `.env` file

2. **YouTube OAuth2** must be configured and authenticated
   - Set `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` in `.env`
   - Complete OAuth2 authentication flow
   - See `OAUTH2_SETUP_GUIDE.md` for setup instructions

3. **YouTube Data API v3** must be enabled
   - Enable in Google Cloud Console
   - Required for fetching video statistics

### Privacy Settings

Videos are uploaded as **PUBLIC** by default for A/B testing purposes:
- Public videos can accumulate views and engagement
- Private videos won't get organic traffic for comparison
- You can change privacy settings in YouTube Studio after upload

## Use Cases

### 1. Prompt Optimization
Test different variations of the same prompt to see which generates better videos:
- Compare video quality
- See which gets more engagement
- Optimize your prompts based on results

### 2. Content Strategy
Understand what type of content performs better:
- Different styles with same prompt
- Compare engagement patterns
- Make data-driven decisions

### 3. Quality Comparison
Since AI generation can vary:
- Generate same prompt twice
- Compare which version is better
- Choose the best one for your needs

## Tips for Best Results

1. **Wait for Views**: Give videos time to accumulate views before comparing
2. **Refresh Regularly**: Click refresh stats periodically to see updated metrics
3. **Share Both Videos**: Share both videos equally to get fair comparison
4. **Same Conditions**: Upload both at the same time for fair testing
5. **Monitor Over Time**: Check stats at different time intervals

## Troubleshooting

### "Not authenticated with YouTube"
- You need to authenticate with YouTube first
- Go back to main page and upload a video to trigger authentication
- Or check `OAUTH2_SETUP_GUIDE.md` for authentication steps

### "YouTube OAuth2 is not configured"
- Set `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` in `.env`
- See `OAUTH2_SETUP_GUIDE.md` for setup instructions

### Stats showing zeros
- Videos need time to accumulate views
- Make sure videos are public
- Share the videos to get traffic
- Refresh stats after some time

### Videos not uploading
- Check YouTube Data API v3 is enabled
- Verify OAuth2 authentication is complete
- Check server logs for detailed error messages

## API Endpoints Used

The A/B testing feature uses these endpoints:

- `POST /api/video/generate` - Generate videos
- `POST /api/youtube/upload` - Upload to YouTube
- `GET /api/youtube/stats/:videoId` - Fetch video statistics
- `GET /api/youtube/auth-status` - Check authentication status

## Technical Details

### Parallel Processing
- Both videos are generated simultaneously using `Promise.all()`
- Reduces total wait time compared to sequential generation
- Both uploads happen in parallel as well

### Stats Fetching
- Uses YouTube Data API v3
- Fetches: statistics, contentDetails, and snippet
- Real-time data directly from YouTube

### Engagement Calculation
```javascript
const scoreA = viewsA + (likesA * 10);
const scoreB = viewsB + (likesB * 10);
```

## Privacy & Data

- No data is stored locally or in a database
- All stats are fetched live from YouTube
- Videos remain on your YouTube channel
- You have full control over uploaded videos

## Next Steps

After A/B testing:
1. Review the winner and analyze why it performed better
2. Delete the losing video from YouTube if desired
3. Use insights to improve future video generation
4. Iterate and test new prompts

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify all prerequisites are met
- See other documentation files for setup help
