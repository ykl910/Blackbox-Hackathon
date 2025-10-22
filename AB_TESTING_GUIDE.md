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

### 3. Generate Videos

1. Click "🎬 Generate Both Videos"
2. Wait for both videos to generate (this happens in parallel)
3. Progress is shown for each video:
   - ⏳ Generating...
   - ✓ Generated

### 4. Preview and Review

Once generation is complete:
- Both videos will display side-by-side
- You can watch and compare the videos
- Download either or both videos if desired
- Review quality before uploading to YouTube

### 5. Upload to YouTube

When you're ready to upload:
1. Click "📺 Upload Both to YouTube"
2. Both videos will upload in parallel
3. Progress updates:
   - 📤 Uploading to YouTube...
   - ✓ Uploaded

### 6. View Comparison

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

### 7. Refresh Stats

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

### 1. Quality Check Before Upload
Generate two videos and review them before uploading:
- Compare video quality
- Choose the best one
- Save YouTube quota by only uploading good videos

### 2. Prompt Optimization
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

1. **Review Before Upload**: Watch both generated videos before uploading to YouTube
2. **Save Quota**: Only upload videos you're satisfied with to conserve YouTube quota
3. **Download Backups**: Download videos before uploading in case you want to re-upload later
4. **Wait for Views**: Give videos time to accumulate views before comparing
5. **Refresh Regularly**: Click refresh stats periodically to see updated metrics
6. **Share Both Videos**: Share both videos equally to get fair comparison
7. **Same Conditions**: Upload both at the same time for fair testing
8. **Monitor Over Time**: Check stats at different time intervals

## Troubleshooting

### "Not authenticated with YouTube"
- You need to authenticate with YouTube first
- Go back to main page and upload a video to trigger authentication
- Or check `OAUTH2_SETUP_GUIDE.md` for authentication steps

### "YouTube OAuth2 is not configured"
- Set `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` in `.env`
- See `OAUTH2_SETUP_GUIDE.md` for setup instructions

### "YouTube upload quota exceeded"
- **Most Common Issue**: You've hit YouTube's daily upload limit
- **Default Limit**: ~6 videos per day (10,000 units quota)
- **A/B Testing Uses**: 3,200 units (2 videos × 1,600 units each)
- **Solutions**:
  - Wait until midnight Pacific Time for quota reset
  - Use a different Google account with separate project
  - Request quota increase from Google
- See `YOUTUBE_QUOTA_GUIDE.md` for detailed solutions

### Stats showing zeros
- Videos need time to accumulate views
- Make sure videos are public
- Share the videos to get traffic
- Refresh stats after some time

### Videos not uploading
- Check YouTube Data API v3 is enabled
- Verify OAuth2 authentication is complete
- Check server logs for detailed error messages
- Verify you haven't exceeded daily quota

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

## Quota Considerations

### YouTube API Limits
- **Daily Quota**: 10,000 units (default)
- **Upload Cost**: 1,600 units per video
- **A/B Test Cost**: 3,200 units (2 videos)
- **Daily A/B Tests**: ~3 tests per day

### Tips to Manage Quota:
1. Plan your A/B tests in advance
2. Use private videos for initial testing
3. Wait for quota reset at midnight PT
4. Request quota increase for production use
5. Use separate Google account for more tests

See `YOUTUBE_QUOTA_GUIDE.md` for complete quota management guide.

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
