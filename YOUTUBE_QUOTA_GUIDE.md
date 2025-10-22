# YouTube API Quota Guide

## Understanding YouTube API Quotas

YouTube Data API v3 has daily quota limits to prevent abuse and ensure fair usage across all developers.

## Default Quota Limits

- **Default Daily Quota**: 10,000 units per day
- **Upload Cost**: 1,600 units per video upload
- **Stats Fetch Cost**: 1 unit per request

### What This Means:
- You can upload approximately **6 videos per day** (10,000 ÷ 1,600 = 6.25)
- You can fetch stats thousands of times per day (very cheap)
- Quota resets at midnight Pacific Time (PT)

## Quota Exceeded Error

### Error Message:
```
"The user has exceeded the number of videos they may upload."
```

### What Happened:
You've reached your daily upload quota limit. This is a YouTube API limitation, not an issue with the application.

## Solutions

### Option 1: Wait for Quota Reset (Recommended)
- **When**: Quota resets at midnight Pacific Time
- **Cost**: Free
- **Best for**: Personal projects, testing

**How to check reset time:**
- Current time in PT: Check [time.is/PT](https://time.is/PT)
- Quota resets at 12:00 AM PT
- Calculate hours until reset

### Option 2: Use a Different Google Account
- **When**: Need to upload immediately
- **Cost**: Free (uses different quota)
- **Best for**: Testing, development

**Steps:**
1. Create a new Google Cloud project with a different Google account
2. Set up OAuth2 credentials for the new project
3. Update `.env` with new credentials
4. Restart server and authenticate with new account

### Option 3: Request Quota Increase
- **When**: Need higher limits permanently
- **Cost**: Free (but requires approval)
- **Best for**: Production applications

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → YouTube Data API v3 → Quotas
3. Click "APPLY FOR HIGHER QUOTA"
4. Fill out the quota increase request form
5. Explain your use case
6. Wait for Google's approval (can take several days)

**Typical Approved Limits:**
- 50,000 - 1,000,000 units per day
- Depends on your use case and justification

## Monitoring Your Quota Usage

### Check Current Usage:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → Dashboard
3. Click on "YouTube Data API v3"
4. View "Queries" chart to see usage

### Set Up Quota Alerts:
1. Go to: APIs & Services → YouTube Data API v3 → Quotas
2. Click on "Quotas & System Limits"
3. Set up alerts for when you reach 80% of quota

## Best Practices for A/B Testing

### Minimize Quota Usage:

1. **Test During Off-Peak Hours**
   - Upload early in your quota day
   - Leaves room for additional tests

2. **Use Private Videos for Testing**
   - Change `privacyStatus` to 'private' in code
   - Test functionality without public uploads
   - Switch to public when ready

3. **Batch Your Tests**
   - Plan multiple A/B tests
   - Execute them together
   - Reduces wasted quota

4. **Delete Test Videos**
   - Remove failed or test videos from YouTube
   - Keeps your channel clean
   - Doesn't recover quota, but good practice

5. **Use Stats Sparingly**
   - Stats fetching is cheap (1 unit)
   - But don't refresh excessively
   - Wait for meaningful data accumulation

## Quota Cost Breakdown

| Operation | Cost (Units) | Daily Limit (10k quota) |
|-----------|--------------|-------------------------|
| Upload Video | 1,600 | 6 videos |
| Get Video Stats | 1 | 10,000 requests |
| List Videos | 1 | 10,000 requests |
| Update Video | 50 | 200 updates |
| Delete Video | 50 | 200 deletions |

## Workarounds for Development

### 1. Mock Mode (Future Enhancement)
Create a mock mode that simulates uploads without actually uploading:
- Generate videos normally
- Skip YouTube upload
- Use fake stats for testing UI
- Good for frontend development

### 2. Staging Environment
- Use separate Google account for staging
- Different quota pool
- Test without affecting production quota

### 3. Video Reuse
- Upload videos once
- Store video IDs
- Reuse for multiple tests
- Only works if video content doesn't matter

## Error Handling in the App

The application now handles quota errors gracefully:

### User-Facing Error:
```
"YouTube upload quota exceeded. You can only upload a limited number 
of videos per day. Please try again tomorrow or use a different 
Google account."
```

### What Happens:
1. Upload attempt fails
2. Error is caught and displayed
3. User is informed about quota limit
4. Suggestions provided for resolution

## FAQ

### Q: Can I pay to increase my quota?
**A:** No, YouTube API quota is not purchasable. You must request an increase and get approval.

### Q: Does deleting videos restore quota?
**A:** No, quota is consumed when you upload. Deleting doesn't restore it.

### Q: Can I use multiple API keys?
**A:** No, quota is per project, not per API key. You need separate Google Cloud projects.

### Q: What if I need to upload urgently?
**A:** Use a different Google account with a separate project, or wait for quota reset.

### Q: How do I know when quota resets?
**A:** Midnight Pacific Time (PT). Check current PT time and calculate hours remaining.

### Q: Can I check remaining quota?
**A:** Yes, in Google Cloud Console → APIs & Services → YouTube Data API v3 → Quotas

### Q: Does A/B testing use double quota?
**A:** Yes, uploading 2 videos uses 3,200 units (1,600 × 2). You can do 3 A/B tests per day.

## Recommendations

### For Personal Use:
- Accept the 6 videos/day limit
- Plan your uploads
- Use private videos for testing
- Wait for quota reset when needed

### For Production:
- Request quota increase immediately
- Explain your use case clearly
- Provide usage estimates
- Plan for approval time (days to weeks)

### For Development:
- Use separate Google account
- Create staging project
- Test with private videos
- Implement mock mode for UI testing

## Support

If you continue to have quota issues:
1. Check Google Cloud Console for exact quota usage
2. Verify quota reset time
3. Consider requesting quota increase
4. Use alternative Google account if urgent

## Related Documentation

- [YouTube Data API Quota](https://developers.google.com/youtube/v3/getting-started#quota)
- [Google Cloud Console](https://console.cloud.google.com)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
