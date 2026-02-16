# PWA Quick Start Guide

## 🚀 Getting Started

### Step 1: Generate Icons

```bash
# Option A: Use the script (requires ImageMagick)
./generate-pwa-icons.sh

# Option B: Manual conversion
# Convert public/icon-192x192.svg → public/icon-192x192.png
# Convert public/icon-512x512.svg → public/icon-512x512.png
```

### Step 2: Build & Test

```bash
# Development mode (service worker may not work)
npm run dev

# Production build (PWA works properly)
npm run build
npm run preview
```

### Step 3: Test on Mobile

1. Open the app URL on your mobile device
2. Navigate to: `/master/user/occupant-users`
3. You should see:
   - ✅ Mobile-optimized layout
   - ✅ No sidebar
   - ✅ Install prompt (after a few visits)

## 📋 What Was Changed

### PWA Routes (Mobile-Optimized)

- `/master/user/occupant-users` - User List
- `/master/user/occupant-users/view/:id` - User Detail

### Key Features

✅ **Mobile-First Design**: No sidebar on mobile devices  
✅ **Auto-Detection**: Automatically switches based on device type  
✅ **Offline Support**: Service worker caches essential assets  
✅ **Installable**: Can be installed as a standalone app  
✅ **Route-Specific**: Only affects the two user routes  
✅ **No Impact**: Desktop views and other routes unchanged

## 🎯 How to Use

### For Mobile Users

1. Visit the occupant users page on mobile
2. Browser will prompt to install the app
3. Tap "Add to Home Screen"
4. App opens in standalone mode (full-screen)
5. Works offline with cached data

### For Desktop Users

- Everything remains exactly the same
- No changes to existing functionality
- Sidebar still visible
- All features work as before

## 🔧 Customization

### Add More PWA Routes

**1. Update `src/utils/pwa.ts`:**

```typescript
export const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
  "/your/new/route", // ← Add here
];
```

**2. Update `public/service-worker.js`:**

```javascript
const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
  "/your/new/route", // ← Add here
];
```

**3. Create mobile components**
**4. Create wrapper component**
**5. Update routes in App.tsx**

### Change App Theme

**Edit `public/manifest.json`:**

```json
{
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

## 🐛 Troubleshooting

### PWA Not Installing

- ✅ Make sure you're using HTTPS (or localhost)
- ✅ Check that manifest.json loads without errors
- ✅ Verify PNG icons exist (not just SVG)
- ✅ Visit the PWA route multiple times
- ✅ Check browser console for errors

### Service Worker Not Working

- ✅ Build production version (`npm run build`)
- ✅ Service workers don't work well in dev mode
- ✅ Clear browser cache and reload
- ✅ Check DevTools → Application → Service Workers

### Mobile View Not Showing

- ✅ Check device detection in browser DevTools
- ✅ Try resizing browser window to <768px
- ✅ Test on actual mobile device
- ✅ Check wrapper component logic

### Icons Not Displaying

- ✅ Generate PNG icons from SVG
- ✅ Check file paths in manifest.json
- ✅ Verify icon files are in public/ folder
- ✅ Clear cache and reinstall app

## 📱 Testing Checklist

**Development:**

- [ ] Code compiles without errors
- [ ] TypeScript checks pass
- [ ] Service worker registers

**Mobile Testing:**

- [ ] List view shows without sidebar
- [ ] Detail view shows without sidebar
- [ ] Search works properly
- [ ] Pagination works
- [ ] Navigation works
- [ ] Install prompt appears
- [ ] App installs successfully

**Desktop Testing:**

- [ ] Sidebar still visible
- [ ] All existing features work
- [ ] No visual changes

**PWA Testing:**

- [ ] Offline mode works
- [ ] Cached pages load offline
- [ ] App opens in standalone mode
- [ ] Icons display correctly

## 📚 Documentation

- **Full Setup**: See [PWA_SETUP.md](PWA_SETUP.md)
- **Implementation**: See [PWA_IMPLEMENTATION_SUMMARY.md](PWA_IMPLEMENTATION_SUMMARY.md)

## 🎉 Success Indicators

When everything is working, you should see:

✅ Mobile users see a clean, sidebar-free interface  
✅ Desktop users see the familiar interface with sidebar  
✅ Browser shows "Install App" prompt on mobile  
✅ Installed app runs in full-screen mode  
✅ App works offline for visited pages  
✅ Other routes continue to work normally

---

**Need Help?** Check the detailed documentation in PWA_SETUP.md
