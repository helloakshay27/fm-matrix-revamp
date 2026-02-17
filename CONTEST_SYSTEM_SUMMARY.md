# Contest System Implementation Summary

## Overview

This document summarizes the unified contest system implementation supporting three contest types: Spinner Wheel, Flip Card, and Scratch Card. All three use the same backend API structure with dynamic configuration.

## Contest Types

### 1. Spinner Wheel Contest

- **Route:** `/spinnercontest`
- **Contest Type:** `spin`
- **UI:** Rotating wheel with prize segments
- **Interaction:** Click "SPIN" button to rotate wheel
- **Features:** Casino sound effects, animated rotation with easing
- **Guide:** [SPINNER_CONTEST_GUIDE.md](./SPINNER_CONTEST_GUIDE.md)

### 2. Flip Card Contest

- **Route:** `/flipcard`
- **Contest Type:** `flip`
- **UI:** Grid of face-down cards
- **Interaction:** Click card to flip and reveal prize
- **Features:** 3D flip animation, multiple attempts support
- **Guide:** [FLIP_CARD_GUIDE.md](./FLIP_CARD_GUIDE.md)

### 3. Scratch Card Contest

- **Route:** `/scratchcard`
- **Contest Type:** `scratch`
- **UI:** Overlay card with scratch-to-reveal mechanic
- **Interaction:** Drag mouse/finger to scratch surface
- **Features:** Canvas-based scratch effect, gradient overlay
- **Guide:** [SCRATCH_CARD_GUIDE.md](./SCRATCH_CARD_GUIDE.md)

## Unified URL Structure

All contests follow the same URL parameter pattern:

```
http://localhost:5173/{contest-route}?org_id={org_id}&token={token}&contest_id={contest_id}
```

### Parameters

- **org_id:** Organization identifier (e.g., "runwal", "hisociety")
- **token:** Authentication token for API access
- **contest_id:** Specific contest identifier

### Examples

```bash
# Spinner Contest
http://localhost:5173/spinnercontest?org_id=runwal&token=abc123&contest_id=1

# Flip Card Contest
http://localhost:5173/flipcard?org_id=runwal&token=abc123&contest_id=2

# Scratch Card Contest
http://localhost:5173/scratchcard?org_id=runwal&token=abc123&contest_id=3
```

## API Architecture

### Base URL Construction

```typescript
baseClient.defaults.baseURL = `https://${org_id}-api.lockated.com`;
baseClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### Endpoints

#### 1. Get Contest Details

```
GET /contests/{contest_id}
```

Returns contest metadata, prizes, and configuration.

#### 2. Play Contest

```
POST /contests/{contest_id}/play
```

Executes the contest action and returns the won prize with `user_contest_reward.id`.

#### 3. Get Reward Details

```
GET /user_contest_rewards/{reward_id}
```

Fetches detailed information about a claimed reward.

## File Structure

### API Services

```
src/services/
├── newSpinnerContestApi.ts    # Spinner wheel API
├── newFlipCardApi.ts           # Flip card API
└── newScratchCardApi.ts        # Scratch card API
```

### Components

```
src/components/mobile/
├── SpinnerContest.tsx          # Spinner wheel UI
├── FlipCard.tsx                # Flip card UI
├── FlipCardDetails.tsx         # Flip card details page
├── ScratchCard.tsx             # Scratch card UI
└── VoucherDetails.tsx          # Unified details page
```

### Utilities

```
src/utils/
├── withoutTokenBase.ts         # baseClient configuration
└── spinSound.ts                # Web Audio sound generator
```

### Routes (App.tsx)

```tsx
{/* Spinner Contest */}
<Route path="/spinnercontest" element={<SpinnerContest />} />

{/* Flip Card Contest */}
<Route path="/flipcard" element={<FlipCard />} />
<Route path="/flipcard/details/:rewardId" element={<FlipCardDetails />} />

{/* Scratch Card Contest */}
<Route path="/scratchcard" element={<ScratchCard />} />
<Route path="/scratchcard/details/:rewardId" element={<VoucherDetails />} />
```

## Common API Response Structure

### Contest Details Response

```json
{
  "id": 1,
  "title": "Contest Title",
  "description": "Contest description",
  "contest_type": "spin|flip|scratch",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "status": "active",
  "image_url": "https://example.com/image.jpg",
  "prizes": [
    {
      "id": 1,
      "title": "Prize Title",
      "description": "Prize description",
      "image_url": "https://example.com/prize.jpg",
      "value": "₹100",
      "probability": 50
    }
  ],
  "attempt_required": 1
}
```

### Play Contest Response

```json
{
  "success": true,
  "user_contest_reward": {
    "id": 123,
    "contest_id": 1,
    "prize_id": 1,
    "reward_code": "CODE123",
    "claimed_at": "2024-01-15T10:30:00Z",
    "status": "claimed"
  }
}
```

### User Contest Reward Response

```json
{
  "id": 123,
  "contest": {
    "id": 1,
    "title": "Contest Title",
    "description": "Contest description",
    "contest_type": "spin|flip|scratch",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "status": "active"
  },
  "prize": {
    "id": 1,
    "title": "Prize Title",
    "description": "Prize description",
    "image_url": "https://example.com/prize.jpg",
    "value": "₹100"
  },
  "reward_code": "CODE123",
  "claimed_at": "2024-01-15T10:30:00Z",
  "status": "claimed"
}
```

## Implementation Patterns

### 1. Parameter Extraction

```typescript
const [searchParams] = useSearchParams();
const orgId = searchParams.get("org_id");
const token = searchParams.get("token");
const urlContestId = searchParams.get("contest_id");
```

### 2. API Initialization

```typescript
useEffect(() => {
  if (orgId && token && urlContestId) {
    newContestApi.initialize(orgId, token);
    // Fetch contest data
  }
}, [orgId, token, urlContestId]);
```

### 3. Play Action

```typescript
const handlePlay = async () => {
  try {
    const result = await newContestApi.playContest(contestId);
    const rewardId = result.user_contest_reward.id;
    localStorage.setItem("last_reward_id", rewardId.toString());
    setWonPrize(result.user_contest_reward);
  } catch (error) {
    console.error("Play error:", error);
  }
};
```

### 4. Navigation to Details

```typescript
const handleViewDetails = () => {
  const rewardId = localStorage.getItem("last_reward_id");
  if (rewardId && orgId && token) {
    navigate(`/details/${rewardId}?org_id=${orgId}&token=${token}`);
  }
};
```

### 5. Details Page Data Fetch

```typescript
useEffect(() => {
  const fetchRewardData = async () => {
    const orgId = searchParams.get("org_id");
    const token = searchParams.get("token");

    baseClient.defaults.baseURL = `https://${orgId}-api.lockated.com`;
    baseClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await baseClient.get(`/user_contest_rewards/${rewardId}`);
    setRewardData(response.data);
  };

  fetchRewardData();
}, [rewardId, searchParams]);
```

## User Flows

### Spinner Contest Flow

1. Access `/spinnercontest?org_id=X&token=Y&contest_id=Z`
2. View spinning wheel with prize segments
3. Click "SPIN" button
4. Watch wheel spin with sound effects
5. See result modal with won prize
6. Click "View Details" to see reward code

### Flip Card Contest Flow

1. Access `/flipcard?org_id=X&token=Y&contest_id=Z`
2. View grid of face-down cards
3. Click card to flip
4. See prize revealed with animation
5. Click "View Details" in modal
6. View full prize details and reward code

### Scratch Card Contest Flow

1. Access `/scratchcard?org_id=X&token=Y&contest_id=Z`
2. View scratch card overlay
3. Drag to scratch surface
4. Reveal prize underneath
5. See congratulations modal
6. Click "View Details" for reward code

## Testing Checklist

### For Each Contest Type

- [ ] URL parameters are correctly extracted
- [ ] API base URL is dynamically set
- [ ] Authentication token is included in requests
- [ ] Contest details load successfully
- [ ] Prize data is displayed correctly
- [ ] Play action triggers API call
- [ ] Won prize is stored with reward_id
- [ ] Details navigation includes parameters
- [ ] Details page fetches reward data
- [ ] Reward code is displayed
- [ ] Error states are handled gracefully
- [ ] Loading states show spinners
- [ ] Navigation back button works

### Additional Tests

- [ ] Multiple contest types work independently
- [ ] Different org_ids use correct base URLs
- [ ] Token expiration shows appropriate error
- [ ] Invalid contest_id returns 404
- [ ] Network errors display user-friendly messages
- [ ] Mobile touch interactions work
- [ ] Desktop mouse interactions work
- [ ] Page refreshes maintain state where appropriate

## Key Features

### Dynamic Configuration

- Base URL constructed from org_id
- Token passed for authentication
- Contest ID determines content
- No hardcoded URLs or tokens

### Unified API Pattern

- Same endpoints for all contest types
- Consistent response structure
- Shared reward retrieval endpoint
- Single baseClient configuration

### Responsive Design

- Works on mobile and desktop
- Touch and mouse event support
- Appropriate sizing for all screens
- Smooth animations and transitions

### Error Handling

- Parameter validation
- API error catching
- User-friendly error messages
- Graceful fallbacks

### State Management

- URL-based configuration
- localStorage for temporary data
- React state for UI updates
- Navigation with parameters

## Migration Notes

### From Old API Structure

**Before:**

- Separate APIs for each contest type
- Hardcoded URLs
- Direct prize data in response
- No unified reward system

**After:**

- Single API pattern for all types
- Dynamic URL construction
- Reward IDs for details retrieval
- Centralized reward management

### Updated Components

1. **SpinnerContest.tsx**
   - Switched to newSpinnerContestApi
   - Added URL parameter handling
   - Stores user_contest_reward.id
   - Navigates with parameters

2. **FlipCard.tsx**
   - Switched to newFlipCardApi
   - Fixed card.reward → card.prize
   - Added URL parameter handling
   - Stores reward_id for details

3. **ScratchCard.tsx**
   - Switched to newScratchCardApi
   - Added URL parameter handling
   - Uses contestData state
   - Navigates to unified details page

4. **VoucherDetails.tsx**
   - Supports both rewardId and cardId parameters
   - Handles new API structure
   - Falls back to old structure
   - Gracefully displays available data

### New Files Created

1. **newSpinnerContestApi.ts** - Spinner API service with baseClient
2. **newFlipCardApi.ts** - Flip card API service with baseClient
3. **newScratchCardApi.ts** - Scratch card API service with baseClient
4. **spinSound.ts** - Web Audio sound generation for spinner
5. **SPINNER_CONTEST_GUIDE.md** - Spinner testing guide
6. **FLIP_CARD_GUIDE.md** - Flip card testing guide
7. **SCRATCH_CARD_GUIDE.md** - Scratch card testing guide

## Deployment Considerations

### Environment Variables

No environment variables needed - all configuration via URL parameters.

### API Requirements

- CORS enabled for frontend domain
- Bearer token authentication
- Proper error responses (401, 403, 404, 500)

### Frontend Build

```bash
npm run build
```

Ensure routes are configured for SPA routing.

### Testing URLs

Use actual domain with parameters:

```
https://your-domain.com/spinnercontest?org_id=runwal&token=xyz&contest_id=1
https://your-domain.com/flipcard?org_id=runwal&token=xyz&contest_id=2
https://your-domain.com/scratchcard?org_id=runwal&token=xyz&contest_id=3
```

## Support & Troubleshooting

### Common Issues

1. **"Missing org_id or token" error**
   - Verify URL includes all parameters
   - Check parameter names are correct (org_id, not orgId)

2. **API 401/403 errors**
   - Verify token is valid and not expired
   - Check token has permissions for contest API

3. **Prize not displaying**
   - Check network tab for API response
   - Verify prize data structure matches expected format
   - Check console for JavaScript errors

4. **Details page not loading**
   - Verify reward_id is in URL
   - Check org_id and token are passed
   - Confirm API endpoint returns data

### Debug Mode

Add console.warn statements to track flow:

```typescript
console.warn("[Contest] Initialized with:", { orgId, token, contestId });
console.warn("[Contest] Play result:", result);
console.warn("[Contest] Navigating to details:", rewardId);
```

## Future Enhancements

- [ ] Add contest listing page
- [ ] Implement reward history
- [ ] Add social sharing
- [ ] Support multiple languages
- [ ] Add animation preferences
- [ ] Implement analytics tracking
- [ ] Add contest favorites
- [ ] Support scheduled contests
- [ ] Add push notifications
- [ ] Implement leaderboards

## Conclusion

The unified contest system provides a flexible, maintainable solution for multiple contest types. By using dynamic configuration via URL parameters and a consistent API pattern, the system can easily support new organizations and contest types without code changes.

All three contest types (Spinner, Flip Card, Scratch Card) follow the same patterns for:

- API initialization
- Data fetching
- Play action execution
- Reward storage
- Details navigation
- Error handling

This consistency makes the system easier to understand, test, and maintain.
