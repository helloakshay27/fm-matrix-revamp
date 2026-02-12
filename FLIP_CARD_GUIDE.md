# Flip Card Contest - Testing Guide

## Overview

The Flip Card feature allows users to flip cards and reveal prizes (points or coupons). It uses the same contest API as the spinner wheel but filters for `content_type: "flip"`.

## URL Structure

### Local Testing URL Format

```
http://localhost:5173/flipcard?org_id=1&token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ&contest_id=2
```

### Production URL Format

```
https://ui-hisociety.lockated.com/flipcard?org_id=1&token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ&contest_id=2
```

## API Endpoints

### 1. Get All Contests (filtered by flip type)

```bash
GET https://runwal-api.lockated.com/contests?token={token}
```

**Example:**

```bash
curl --location 'https://runwal-api.lockated.com/contests?token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ'
```

**Response (filtered for content_type=flip):**

```json
{
  "id": 2,
  "name": "Flip & Win",
  "description": "contest description",
  "terms_and_conditions": null,
  "content_type": "flip",
  "active": true,
  "start_at": "2026-02-01T03:02:00.000+05:30",
  "end_at": "2026-03-02T23:59:59.999+05:30",
  "user_caps": 1,
  "attemp_required": 3,
  "prizes": [
    {
      "id": 3,
      "title": "Special Offer",
      "reward_type": "coupon",
      "coupon_code": "OSDTHEKKO",
      "partner_name": "Partner Name",
      "probability_value": 2,
      "probability_out_of": 8,
      "position": 1,
      "active": true
    }
  ]
}
```

### 2. Play/Flip Card

```bash
POST https://runwal-api.lockated.com/contests/{contest_id}/play?token={token}
```

**Example:**

```bash
curl --location --request POST 'https://runwal-api.lockated.com/contests/2/play?token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ'
```

## Features

### 🎨 Visual Features

- Card flip animation with 3D transform
- Golden gradient on unflipped cards
- Radial glow effect
- Revealed prize display
- Attempts counter
- Responsive mobile design

### 🎯 Prize Types

1. **Points Rewards**
   - Display: Points value
   - Shows total points won
2. **Coupon Rewards**
   - Display: Coupon code
   - Shows partner name
   - Copy to clipboard functionality

### 🎮 Game Mechanics

- **Attempts**: Defined by `attemp_required` field (default: 3)
- **User Caps**: Max plays per user from `user_caps` field
- **Prizes**: Based on probability distribution
- **Card Reveal**: One-time flip per card

## Files Created/Modified

### New Files

1. **`/src/services/newFlipCardApi.ts`**
   - API service for flip card contests
   - Uses baseClient for dynamic base URL
   - Token-based authentication
   - Prize to card conversion

### Modified Files

1. **`/src/components/mobile/FlipCard.tsx`**
   - Updated to use new API structure
   - Added URL parameter handling (org_id, token, contest_id)
   - Added result modal
   - Updated UI for new prize structure
   - Added attempts counter

## How to Test Locally

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Open Test URL

Navigate to:

```
http://localhost:5173/flipcard?org_id=1&token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ&contest_id=2
```

### Step 3: Test Functionality

1. ✅ Verify contest details load correctly
2. ✅ Check that cards are displayed based on `attemp_required`
3. ✅ Verify attempts counter shows correct number
4. ✅ Click on an unflipped card
5. ✅ Watch flip animation
6. ✅ Verify prize is revealed on card
7. ✅ Check result modal appears
8. ✅ Test "Copy To Clipboard" functionality
9. ✅ Verify attempts counter decreases
10. ✅ Try flipping another card if attempts remain

## URL Parameters

| Parameter    | Required | Description                            | Example                                       |
| ------------ | -------- | -------------------------------------- | --------------------------------------------- |
| `org_id`     | Optional | Organization ID for dynamic base URL   | `1`                                           |
| `token`      | Required | Authentication token                   | `QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ` |
| `contest_id` | Required | Contest ID to load (must be flip type) | `2`                                           |

## Dynamic Base URL Logic

The base URL is determined in this order:

1. **From org_id parameter** (currently defaults to runwal-api.lockated.com)
2. **Fallback** to runwal-api.lockated.com

You can extend the logic in `/src/services/newFlipCardApi.ts` to map different org_ids to different base URLs.

## Browser Console Logs

When testing, check browser console for detailed logs:

- `✅` - Success operations
- `🌐` - API calls
- `🎲` - Play/flip action
- `🎁` - Prize won
- `🎯` - Component parameters
- `🔧` - API initialization
- `❌` - Errors

## Differences from Spinner Contest

| Feature        | Spinner Wheel          | Flip Card                          |
| -------------- | ---------------------- | ---------------------------------- |
| API Filter     | `content_type: "spin"` | `content_type: "flip"`             |
| Animation      | Rotation               | 3D Flip                            |
| Sound          | Casino sounds          | Silent                             |
| Cards/Segments | Based on prizes        | Based on `attemp_required`         |
| Multiple Plays | One spin               | Multiple flips (based on attempts) |

## Troubleshooting

### Issue: Contest not loading

**Solution:** Check that:

- Token is valid
- Contest ID exists and has `content_type: "flip"`
- Contest has active prizes
- Network connection is working

### Issue: Cards don't flip

**Solution:** Verify:

- Contest has active prizes
- Attempts remaining > 0
- API is returning prizes in response
- Console for any errors

### Issue: Wrong base URL

**Solution:**

- Check org_id parameter in URL
- Verify token parameter is present
- Check console logs for base URL being used

### Issue: No attempts remaining

**Solution:**

- Check `attemp_required` field in contest
- User may have reached `user_caps` limit
- Contest may have expired

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Best Practices

1. **Always check attempts**: Disable interaction when attempts reach 0
2. **Handle API errors**: Show user-friendly error messages
3. **Validate contest type**: Ensure `content_type === "flip"`
4. **Cache results**: Store flipped cards to prevent re-flipping
5. **Clear state**: Reset game state when switching contests
