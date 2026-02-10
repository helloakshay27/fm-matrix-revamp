# Scratch Card Contest Testing Guide

## Overview

The Scratch Card contest allows users to scratch a virtual card to reveal prizes. This guide covers the complete implementation using the new unified API structure.

## URL Format

```
http://localhost:5173/scratchcard?org_id={org_id}&token={token}&contest_id={contest_id}
```

### Example URL

```
http://localhost:5173/scratchcard?org_id=runwal&token=your-auth-token&contest_id=3
```

## API Endpoints

### 1. Get Contest Details

```
GET https://{org_id}-api.lockated.com/contests/{contest_id}
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": 3,
  "title": "Scratch & Win Contest",
  "description": "Scratch the card to reveal your prize!",
  "contest_type": "scratch",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "status": "active",
  "image_url": "https://example.com/scratch-card-bg.jpg",
  "prizes": [
    {
      "id": 1,
      "title": "10% OFF Voucher",
      "description": "Get 10% off on your next purchase",
      "image_url": "https://example.com/prize1.jpg",
      "value": "₹100",
      "probability": 50
    },
    {
      "id": 2,
      "title": "Free Coffee",
      "description": "Enjoy a complimentary coffee",
      "image_url": "https://example.com/prize2.jpg",
      "value": "₹50",
      "probability": 30
    }
  ],
  "attempt_required": 1
}
```

### 2. Play Contest (Scratch Card)

```
POST https://{org_id}-api.lockated.com/contests/{contest_id}/play
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "user_contest_reward": {
    "id": 456,
    "contest_id": 3,
    "prize_id": 1,
    "reward_code": "SCRATCH10OFF",
    "claimed_at": "2024-01-15T10:30:00Z",
    "status": "claimed"
  }
}
```

### 3. Get Reward Details

```
GET https://{org_id}-api.lockated.com/user_contest_rewards/{reward_id}
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": 456,
  "contest": {
    "id": 3,
    "title": "Scratch & Win Contest",
    "description": "Scratch the card to reveal your prize!",
    "contest_type": "scratch",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "status": "active"
  },
  "prize": {
    "id": 1,
    "title": "10% OFF Voucher",
    "description": "Get 10% off on your next purchase",
    "image_url": "https://example.com/prize1.jpg",
    "value": "₹100"
  },
  "reward_code": "SCRATCH10OFF",
  "claimed_at": "2024-01-15T10:30:00Z",
  "status": "claimed"
}
```

## Implementation Files

### Core Files

1. **ScratchCard.tsx** (`/src/components/mobile/ScratchCard.tsx`)
   - Main scratch card UI component
   - Canvas-based scratch surface
   - Handles scratch interactions (mouse/touch)
   - Calls play API when fully scratched

2. **newScratchCardApi.ts** (`/src/services/newScratchCardApi.ts`)
   - API service using baseClient
   - Handles dynamic base URL and token
   - Methods: `initialize()`, `getContestById()`, `playContest()`

3. **VoucherDetails.tsx** (`/src/components/mobile/VoucherDetails.tsx`)
   - Unified details page for all contest types
   - Supports both old and new API structures
   - Displays prize details, reward code, contest info

### Routes

```tsx
// In App.tsx
<Route path="/scratchcard" element={<ScratchCard />} />
<Route path="/scratchcard/:cardId" element={<ScratchCard />} />
<Route path="/scratchcard/details/:rewardId" element={<VoucherDetails />} />
<Route path="/scratchcard/:cardId/voucher" element={<VoucherDetails />} />
```

## User Flow

1. **Access Contest**
   - User visits URL with org_id, token, and contest_id parameters
   - ScratchCard component extracts parameters from URL
   - Initializes API with dynamic base URL and token

2. **Load Contest**
   - Calls `GET /contests/{contest_id}`
   - Displays contest title, description, and background
   - Renders scratch surface overlay on canvas

3. **Scratch Card**
   - User scratches the card with mouse or touch
   - Canvas tracks scratch progress
   - Prize image gradually reveals underneath

4. **Reveal Prize**
   - When threshold is reached (e.g., 70% scratched), calls `POST /contests/{contest_id}/play`
   - Receives `user_contest_reward` with reward_id
   - Stores reward_id in localStorage
   - Shows congratulations modal with prize details

5. **View Details**
   - User clicks "View Details" button
   - Navigates to `/scratchcard/details/{reward_id}?org_id={org_id}&token={token}`
   - VoucherDetails component fetches from `GET /user_contest_rewards/{reward_id}`
   - Displays full prize details, reward code, and contest info

## Testing Steps

### Local Testing

1. **Start Development Server**

```bash
npm run dev
```

2. **Test URL**

```
http://localhost:5173/scratchcard?org_id=runwal&token=your-token&contest_id=3
```

3. **Verify Console Logs**

- Check browser console for initialization messages
- Verify API base URL is set correctly
- Confirm contest data is fetched

4. **Test Scratch Interaction**

- Click and drag on the card surface
- Verify scratch effect reveals prize underneath
- Check canvas drawing performance

5. **Test Prize Reveal**

- Scratch until threshold is reached
- Verify play API is called
- Check reward_id is stored in localStorage
- Confirm modal appears with prize details

6. **Test Details Navigation**

- Click "View Details" button
- Verify navigation includes org_id and token parameters
- Confirm reward details are fetched and displayed
- Test "Get Code" button to reveal reward code

### API Testing

You can test the API endpoints directly using curl:

```bash
# Get contest details
curl -X GET "https://runwal-api.lockated.com/contests/3" \
  -H "Authorization: Bearer your-token"

# Play contest
curl -X POST "https://runwal-api.lockated.com/contests/3/play" \
  -H "Authorization: Bearer your-token"

# Get reward details
curl -X GET "https://runwal-api.lockated.com/user_contest_rewards/456" \
  -H "Authorization: Bearer your-token"
```

## Features

### Canvas Scratch Surface

- Gradient overlay with metallic effect
- Mouse and touch event handling
- Smooth scratch path drawing
- Progress tracking based on cleared pixels

### Dynamic Configuration

- Base URL constructed from org_id parameter
- Token passed via URL for authentication
- Contest ID determines which contest to load

### Prize Display

- Shows prize image underneath scratch surface
- Animated reveal as user scratches
- Congratulations modal on completion

### Error Handling

- Validates URL parameters (org_id, token, contest_id)
- Handles API errors gracefully
- Shows user-friendly error messages
- Fallback for missing data

## Troubleshooting

### Contest Not Loading

- Check console for API errors
- Verify org_id, token, and contest_id in URL
- Confirm token is valid and not expired
- Check network tab for API request/response

### Scratch Not Working

- Verify canvas is properly initialized
- Check browser console for JavaScript errors
- Ensure touch events are enabled on mobile devices
- Verify canvas dimensions are set correctly

### Prize Not Revealing

- Check if play API is being called
- Verify scratch threshold is reached
- Look for errors in play API response
- Confirm reward_id is stored in localStorage

### Details Page Not Loading

- Verify reward_id is passed in URL
- Check if org_id and token parameters are included
- Confirm API endpoint returns valid data
- Check network tab for 401/403 errors

## Key Differences from Old API

### Old Structure

- Separate endpoint for each scratch card
- Static configuration
- Direct voucher code in response

### New Structure

- Unified contests endpoint
- Dynamic base URL and token
- Rewards stored separately with user_contest_reward.id
- Supports multiple contest types (spin, flip, scratch)

## Implementation Notes

### baseClient Configuration

```typescript
// In newScratchCardApi.ts
export const newScratchCardApi = {
  initialize: (orgId: string, token: string) => {
    baseClient.defaults.baseURL = `https://${orgId}-api.lockated.com`;
    baseClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  // ... other methods
};
```

### State Management

```typescript
// In ScratchCard.tsx
const [searchParams] = useSearchParams();
const orgId = searchParams.get("org_id");
const token = searchParams.get("token");
const urlContestId = searchParams.get("contest_id");

const [contestData, setContestData] = useState<ScratchContest | null>(null);
const [wonPrize, setWonPrize] = useState<Prize | null>(null);
```

### Navigation with Parameters

```typescript
// Navigate to details page with parameters
navigate(`/scratchcard/details/${rewardId}?org_id=${orgId}&token=${token}`);
```

## Related Guides

- [SPINNER_CONTEST_GUIDE.md](./SPINNER_CONTEST_GUIDE.md) - Spinner wheel contest
- [FLIP_CARD_GUIDE.md](./FLIP_CARD_GUIDE.md) - Flip card contest
- [API_MIGRATION.md](./API_MIGRATION.md) - Migration from old to new API structure
