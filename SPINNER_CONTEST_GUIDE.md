# Spinner Contest - Testing Guide

## Overview

The Spinner Contest feature allows users to spin a wheel and win prizes (points or coupons). It integrates with a dynamic API based on organization ID and uses token-based authentication.

## URL Structure

### Production URL Format

```
https://ui-hisociety.lockated.com/spinnercontest?org_id={org_id}&token={token}&contest_id={contest_id}
```

### Local Testing URL Format

```
http://localhost:5173/spinnercontest?org_id=1&token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ&contest_id=1
```

## API Endpoints

### 1. Get Contest Details

```bash
GET https://runwal-api.lockated.com/contests/{contest_id}?token={token}
```

**Example:**

```bash
curl --location 'https://runwal-api.lockated.com/contests/1?token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ'
```

**Response:**

```json
{
  "id": 1,
  "name": "Daily Spin & Win",
  "description": null,
  "terms_and_conditions": null,
  "content_type": "spin",
  "active": true,
  "start_at": "2026-02-07T05:30:00.000+05:30",
  "end_at": "2026-03-01T05:29:59.000+05:30",
  "user_caps": null,
  "attemp_required": null,
  "prizes": [
    {
      "id": 1,
      "title": "100 Loyalty Points",
      "reward_type": "points",
      "points_value": 100,
      "probability_value": 2,
      "probability_out_of": 10,
      "position": 1,
      "active": true
    },
    {
      "id": 2,
      "title": "₹100 Voucher",
      "reward_type": "coupon",
      "coupon_code": "SPIN100",
      "partner_name": "Amazon",
      "probability_value": 1,
      "probability_out_of": 10,
      "position": 2,
      "active": true
    }
  ]
}
```

### 2. Play/Spin Contest

```bash
POST https://runwal-api.lockated.com/contests/{contest_id}/play?token={token}
```

**Example:**

```bash
curl --location --request POST 'https://runwal-api.lockated.com/contests/1/play?token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ'
```

## Features

### 🎨 Visual Features

- Colorful spinning wheel with prize segments
- Smooth rotation animation with easing
- Pointer at the top to indicate the winning prize
- Responsive design for mobile devices

### 🔊 Sound Effects

- **Casino-style spinning sound** - plays during wheel rotation
  - Gradual pitch decrease simulating slowing down
  - Clicking sounds that get slower as wheel decelerates
- **Win celebration sound** - plays when result is shown
  - Pleasant ascending musical notes

### 🎯 Prize Types

1. **Points Rewards**
   - Display: "100 Loyalty Points"
   - Shows points value
2. **Coupon Rewards**
   - Display: Coupon code (e.g., "SPIN100")
   - Shows partner name if available
   - Copy to clipboard functionality

## Files Modified/Created

### New Files

1. **`/src/services/newSpinnerContestApi.ts`**
   - API service for new contest structure
   - Dynamic base URL based on org_id parameter
   - Token-based authentication
   - Prize to wheel segment conversion

2. **`/src/utils/spinSound.ts`**
   - Web Audio API sound generator
   - Casino-style spinning sound
   - Win celebration sound
   - Click sounds during rotation

### Modified Files

1. **`/src/components/mobile/SpinnerContest.tsx`**
   - Updated to use new API structure
   - Added URL parameter handling (org_id, token, contest_id)
   - Integrated sound effects
   - Updated UI for new prize structure

## How to Test Locally

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Open Test URL

Navigate to:

```
http://localhost:5173/spinnercontest?org_id=1&token=QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ&contest_id=1
```

### Step 3: Test Functionality

1. ✅ Verify contest details load correctly
2. ✅ Check that all prize segments are displayed on wheel
3. ✅ Click "Tap To Spin" button
4. ✅ Listen for casino spinning sound
5. ✅ Wait for wheel to stop spinning
6. ✅ Verify winning prize is shown in modal
7. ✅ Test "Copy To Clipboard" functionality
8. ✅ Check sound plays when result is shown

## URL Parameters

| Parameter    | Required | Description                          | Example                                       |
| ------------ | -------- | ------------------------------------ | --------------------------------------------- |
| `org_id`     | Optional | Organization ID for dynamic base URL | `1`                                           |
| `token`      | Required | Authentication token                 | `QsUjajggGCYJJGKndHkRidBxJN2cIUC06lr42Vru1EQ` |
| `contest_id` | Required | Contest ID to load                   | `1`                                           |

## Dynamic Base URL Logic

The base URL is determined in this order:

1. **From org_id parameter** (currently defaults to runwal-api.lockated.com)
2. **Fallback** to runwal-api.lockated.com

You can extend the logic in `/src/services/newSpinnerContestApi.ts` to map different org_ids to different base URLs.

## Browser Console Logs

When testing, check browser console for detailed logs:

- `✅` - Success operations
- `📡` - API calls
- `🎲` - Play/spin action
- `🎁` - Prize won
- `🎨` - Wheel segments created
- `❌` - Errors

## Troubleshooting

### Issue: No sound plays

**Solution:** Some browsers block autoplay audio. User must interact with page first (click anywhere).

### Issue: Contest not loading

**Solution:** Check that:

- Token is valid
- Contest ID exists
- Contest has active prizes
- Network connection is working

### Issue: Wheel doesn't spin

**Solution:** Verify:

- Contest has active prizes
- API is returning prizes in response
- Console for any errors

### Issue: Wrong base URL

**Solution:**

- Check org_id parameter in URL
- Verify token parameter is present
- Check console logs for base URL being used

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Sound Technology

Uses Web Audio API for generating casino sounds:

- No external sound files needed
- Works offline
- Lightweight and performant
- Procedurally generated audio
