# 🚀 Desktop App Deployment Guide

## Overview

This guide covers how to deploy your desktop application builds using GitHub Releases.

## ⚠️ Important: Don't Commit Build Files

Desktop builds (`.dmg`, `.exe`, `.zip`, etc.) are **large binary files** and should **NOT** be committed to git. Instead:

- ✅ Commit source code (including `electron/` folder)
- ✅ Use GitHub Releases to distribute builds
- ❌ Don't commit the `release/` folder
- ❌ Don't commit `.dmg`, `.exe`, `.zip` files

The `.gitignore` file is already configured to exclude these files.

## 📦 Deployment Methods

### Method 1: Manual GitHub Releases (Recommended for Small Teams)

#### Step 1: Build Your Desktop App

```bash
# Build for your current platform
npm run electron:build:mac   # macOS
npm run electron:build:win   # Windows
npm run electron:build:all   # Both

# Builds will be in the release/ folder
```

#### Step 2: Create a Git Tag

```bash
# Commit your latest changes (source code only)
git add .
git commit -m "Release v1.0.0"

# Create a version tag
git tag v1.0.0

# Push code and tags to GitHub
git push origin main
git push origin v1.0.0
```

#### Step 3: Create GitHub Release

1. Go to your repository on GitHub
2. Click **"Releases"** → **"Create a new release"**
3. Choose the tag you just created (e.g., `v1.0.0`)
4. Fill in release details:
   - **Release title**: FM Matrix v1.0.0
   - **Description**: Add changelog and features
5. **Drag and drop** your build files from `release/` folder:
   - `FM Matrix-0.0.0.dmg` (macOS Intel)
   - `FM Matrix-0.0.0-arm64.dmg` (macOS Apple Silicon)
   - `FM Matrix Setup 0.0.0.exe` (Windows installer)
   - `FM Matrix-0.0.0-win.zip` (Windows portable)
6. Click **"Publish release"**

#### Step 4: Share Download Links

Users can now download from:

```
https://github.com/YOUR_USERNAME/fm-matrix-redesign/releases/latest
```

---

### Method 2: Automated GitHub Actions (Recommended for Production)

Create `.github/workflows/build.yml`:

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build web app
        run: npm run build

      - name: Build desktop app (macOS)
        if: matrix.os == 'macos-latest'
        run: npm run electron:build:mac

      - name: Build desktop app (Windows)
        if: matrix.os == 'windows-latest'
        run: npm run electron:build:win

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/*

      - name: Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: release/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**To trigger the build:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically build for both platforms and create a release.

---

### Method 3: electron-builder Publish (Advanced)

Add to `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "YOUR_USERNAME",
      "repo": "fm-matrix-redesign"
    }
  }
}
```

Set GitHub token:

```bash
export GH_TOKEN="your_github_personal_access_token"
```

Build and publish:

```bash
npm run electron:build:mac -- --publish always
npm run electron:build:win -- --publish always
```

---

## 🔐 Code Signing (Production Apps)

### macOS Code Signing

1. Get an Apple Developer certificate
2. Add to `package.json`:

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    }
  }
}
```

3. Notarize the app:

```bash
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
npm run electron:build:mac
```

### Windows Code Signing

1. Get a code signing certificate
2. Add to `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "password"
    }
  }
}
```

---

## 📝 Version Management

Update version before each release:

**package.json:**

```json
{
  "version": "1.0.0"
}
```

The version number will automatically appear in:

- File names: `FM Matrix-1.0.0.dmg`
- About dialog
- Windows installer

---

## 🎯 Best Practices

1. **Semantic Versioning**: Use MAJOR.MINOR.PATCH (e.g., 1.0.0, 1.0.1, 1.1.0)
2. **Changelog**: Include release notes with each version
3. **Testing**: Test builds on target platforms before releasing
4. **Auto-updates**: Consider implementing electron-updater for automatic updates
5. **Beta Releases**: Use pre-release tags for testing (v1.0.0-beta.1)

---

## 🔄 Auto-Update Setup (Optional)

Install electron-updater:

```bash
npm install electron-updater
```

Add to `electron/main.js`:

```javascript
const { autoUpdater } = require("electron-updater");

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

Add to `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "YOUR_USERNAME",
      "repo": "fm-matrix-redesign"
    }
  }
}
```

---

## 📊 Release Checklist

- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md
- [ ] Test the app locally
- [ ] Build for all platforms
- [ ] Test built apps on target systems
- [ ] Create git tag
- [ ] Push code and tags to GitHub
- [ ] Create GitHub Release
- [ ] Upload build artifacts
- [ ] Write release notes
- [ ] Publish release
- [ ] Test download links
- [ ] Announce to users

---

## 🆘 Troubleshooting

### Build fails on GitHub Actions

**Problem**: Missing dependencies or environment variables

**Solution**: Add all required secrets to GitHub repository settings:

- `GH_TOKEN` for releases
- `APPLE_ID`, `APPLE_ID_PASSWORD` for macOS notarization
- `CSC_LINK`, `CSC_KEY_PASSWORD` for code signing

### Large file size

**Problem**: Build files exceed GitHub's 2GB limit

**Solution**: Use external hosting:

- AWS S3
- DigitalOcean Spaces
- Cloudflare R2
- Update publish configuration accordingly

### Users can't install on macOS

**Problem**: "App is damaged" error

**Solution**:

1. Code sign the app properly
2. Notarize with Apple
3. Or instruct users to: `xattr -cr /Applications/FM\ Matrix.app`

---

## 📚 Additional Resources

- [electron-builder Documentation](https://www.electron.build/)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Apple Code Signing](https://developer.apple.com/support/code-signing/)
- [electron-updater](https://www.electron.build/auto-update)

---

## 🎓 Quick Start for First Release

1. **Build the app:**

   ```bash
   npm run electron:build:all
   ```

2. **Test the builds** in `release/` folder

3. **Create a release:**

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Upload to GitHub Releases** manually

Done! Your users can now download from GitHub Releases page.
