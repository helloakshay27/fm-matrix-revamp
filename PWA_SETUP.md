# PWA Setup for Occupant Users

This project includes PWA (Progressive Web App) functionality specifically for the Occupant Users module.

## PWA Routes

The PWA is configured to work only for these specific routes:

- `/master/user/occupant-users` - User List (Mobile optimized)
- `/master/user/occupant-users/view/:id` - User Detail (Mobile optimized)

## Features

### Mobile-First Design

- **No Sidebar**: Mobile views automatically hide the sidebar for better mobile experience
- **Touch-Optimized**: All interactive elements are sized for touch screens
- **Responsive Cards**: User information displayed in card format for easy scanning
- **Native-Like Navigation**: Bottom navigation and sticky headers

### PWA Capabilities

- **Offline Support**: Service worker caches essential assets
- **Installable**: Users can install the app on their mobile devices
- **Standalone Mode**: Runs in full-screen mode when installed
- **Route-Specific**: PWA functionality only applies to user management routes

## Setup Instructions

### 1. Generate PWA Icons

Run the icon generation script:

```bash
./generate-pwa-icons.sh
```

Or manually create PNG icons from the SVG files in the `public/` directory:

- `icon-192x192.svg` → `icon-192x192.png`
- `icon-512x512.svg` → `icon-512x512.png`

### 2. Build and Deploy

```bash
npm run build
```

### 3. Testing PWA

1. **Development Mode**:

   ```bash
   npm run dev
   ```

   Note: Service workers may not work properly in dev mode. Use production build for testing.

2. **Production Build**:

   ```bash
   npm run build
   npm run preview
   ```

3. **Test on Mobile Device**:
   - Access the app from your mobile browser
   - Navigate to `/master/user/occupant-users`
   - You should see the mobile-optimized view
   - Browser will prompt to install the app

## File Structure

```
fm-matrix-redesign/
├── public/
│   ├── manifest.json          # PWA manifest configuration
│   ├── service-worker.js      # Service worker for offline support
│   ├── icon-192x192.png       # PWA icon (small)
│   └── icon-512x512.png       # PWA icon (large)
├── src/
│   ├── components/
│   │   ├── mobile/
│   │   │   ├── OccupantUserMobileList.tsx    # Mobile list view
│   │   │   └── OccupantUserMobileDetail.tsx  # Mobile detail view
│   │   ├── OccupantUserListWrapper.tsx       # Route wrapper for list
│   │   └── OccupantUserDetailWrapper.tsx     # Route wrapper for detail
│   └── utils/
│       └── pwa.ts             # PWA utility functions
```

## How It Works

### Route Detection

The application automatically detects:

1. **Device Type**: Checks if the user is on a mobile device
2. **Screen Size**: Checks if the viewport is less than 768px
3. **Route**: Checks if the current route is a PWA-enabled route

### Component Rendering

- **Mobile Devices**: Renders mobile-optimized components without sidebar
- **Desktop Devices**: Renders full desktop layout with sidebar
- **Other Routes**: Uses standard layout regardless of device

### Service Worker

The service worker:

- Only caches assets for PWA routes
- Uses network-first strategy for API calls
- Provides offline fallback for cached routes
- Automatically updates when new version is deployed

## Customization

### Adding More PWA Routes

1. Update `src/utils/pwa.ts`:

```typescript
export const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
  "/your/new/route", // Add your route here
];
```

2. Update `public/service-worker.js`:

```javascript
const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
  "/your/new/route", // Add your route here
];
```

3. Create mobile components for the new routes
4. Create wrapper components to handle mobile/desktop switching

### Customizing Theme Colors

Edit `public/manifest.json`:

```json
{
  "theme_color": "#1976d2", // Change app theme color
  "background_color": "#ffffff" // Change splash screen color
}
```

## Testing Checklist

- [ ] Mobile list view loads without sidebar
- [ ] Mobile detail view loads without sidebar
- [ ] Desktop view still shows sidebar
- [ ] Service worker registers successfully
- [ ] Offline mode works for cached routes
- [ ] Install prompt appears on mobile
- [ ] App installs successfully
- [ ] Installed app runs in standalone mode
- [ ] Icons display correctly in app launcher

## Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Android & Desktop)
- ✅ Edge (Windows & Android)
- ❌ Internet Explorer (Not supported)

## Troubleshooting

### Service Worker Not Registering

- Check browser console for errors
- Ensure you're using HTTPS (or localhost)
- Clear browser cache and reload

### Install Prompt Not Showing

- Check that manifest.json is loaded correctly
- Verify icons are accessible
- Ensure you're on a PWA-enabled route
- Try visiting the site multiple times

### Mobile View Not Loading

- Check device detection logic
- Verify screen size detection
- Check route matching logic in wrapper components

## Notes

- PWA functionality is isolated to specific routes only
- Other routes continue to work normally with existing layouts
- Desktop users are unaffected by PWA changes
- Service worker caching is route-specific to avoid conflicts
