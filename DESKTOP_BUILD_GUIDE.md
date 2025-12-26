# FM Matrix Desktop Build Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Development

### Run in Development Mode

```bash
npm run electron:dev
```

This will start both the Vite dev server and Electron in development mode with hot-reloading.

## Building for Production

### Build for Current Platform

```bash
npm run electron:build
```

### Build for macOS Only

```bash
npm run electron:build:mac
```

This will create:

- `.dmg` installer for macOS (Intel x64 and Apple Silicon arm64)
- `.zip` portable version

Output location: `release/`

### Build for Windows Only

```bash
npm run electron:build:win
```

This will create:

- `.exe` NSIS installer for Windows (x64 and x86)
- `.zip` portable version

Output location: `release/`

### Build for Both macOS and Windows

```bash
npm run electron:build:all
```

⚠️ **Important Notes:**

- Building for macOS requires macOS
- Building for Windows can be done on macOS/Linux using Wine
- For Windows builds on macOS, install Wine: `brew install wine-stable`

## Build Output

All builds will be created in the `release/` directory:

### macOS

- `FM Matrix-1.0.0.dmg` - DMG installer
- `FM Matrix-1.0.0-mac.zip` - Portable version
- `FM Matrix-1.0.0-arm64-mac.zip` - Apple Silicon version

### Windows

- `FM Matrix Setup 1.0.0.exe` - NSIS installer
- `FM Matrix-1.0.0-win.zip` - Portable version

## App Icons

To customize the app icon:

1. **macOS**: Place your icon as `build/icon.icns` (1024x1024 PNG converted to ICNS)
2. **Windows**: Place your icon as `build/icon.ico` (256x256 PNG converted to ICO)

### Converting PNG to ICNS/ICO

**For macOS (ICNS):**

```bash
# Using iconutil (built-in on macOS)
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset -o build/icon.icns
```

**For Windows (ICO):**
You can use online converters or tools like ImageMagick:

```bash
brew install imagemagick
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 build/icon.ico
```

## Configuration

The Electron Builder configuration is in `electron-builder.json`. You can modify:

- App ID
- Product name
- Build targets
- Installer options
- Code signing (requires certificates)

## Code Signing

### macOS

To sign your macOS app, you need:

1. Apple Developer account
2. Developer ID Application certificate
3. Set environment variables:
   ```bash
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your-password
   ```

### Windows

To sign your Windows app, you need:

1. Code signing certificate
2. Set environment variables:
   ```bash
   export CSC_LINK=/path/to/certificate.pfx
   export CSC_KEY_PASSWORD=your-password
   ```

## Troubleshooting

### "electron: command not found"

Make sure all dependencies are installed:

```bash
npm install
```

### Build fails on macOS

Ensure you have Xcode Command Line Tools:

```bash
xcode-select --install
```

### Build fails on Windows (from macOS)

Install Wine for cross-platform building:

```bash
brew install wine-stable
```

### Large build size

The first build will be larger as it downloads dependencies. Subsequent builds will be faster.

## Distribution

### macOS

- `.dmg` file: Users can drag to Applications folder
- Requires notarization for Gatekeeper (macOS 10.15+)

### Windows

- `.exe` installer: Standard Windows installation
- `.zip` portable: Extract and run without installation

## Updates

To enable auto-updates, integrate electron-updater:

```bash
npm install electron-updater
```

Then configure update servers in your build configuration.
