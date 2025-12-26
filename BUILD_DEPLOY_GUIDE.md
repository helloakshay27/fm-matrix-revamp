# 📦 Build & Deploy Guide

## What Gets Committed to Git

### ✅ **DO COMMIT** (Source Code)

- `src/` - Application source code
- `electron/` - Electron main process files
- `public/` - Static assets (including icon source: `pwa-512x512.png`)
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- Documentation files (`.md`)
- GitHub Actions workflows (`.github/`)
- `generate-icons.sh` - Icon generation script

### ❌ **DON'T COMMIT** (Generated Files)

- `dist/` - Web build output (auto-generated)
- `release/` - Desktop app builds (auto-generated)
- `build/` - Desktop icons (auto-generated from `public/pwa-512x512.png`)
- `node_modules/` - Dependencies
- `.dmg`, `.exe`, `.zip` - Build artifacts

**Why?** These are automatically generated during build and would make the repository huge.

---

## 🔄 How Icon Generation Works

Icons are **generated automatically** from `public/pwa-512x512.png`:

1. **macOS**: `build/icon.icns` (multiple resolutions)
2. **Windows**: `build/icon.ico` (256x256)
3. **Linux**: `build/icon.png` (512x512)

### Manual Generation

```bash
./generate-icons.sh
```

### Automatic Generation

Icons are generated automatically when you run:

```bash
npm run electron:build:mac
npm run electron:build:win
npm run electron:build:all
```

---

## 🚀 Build Process

### Local Development

```bash
# Install dependencies (first time)
npm install

# Run web app in dev mode
npm run dev

# Run desktop app in dev mode
npm run electron:dev
```

### Building Desktop App

```bash
# Build for current platform (generates icons automatically)
npm run electron:build:mac   # macOS
npm run electron:build:win   # Windows
npm run electron:build:all   # Both

# Output in: release/ folder
```

---

## 📤 Deployment to GitHub

### Step 1: Commit Only Source Code

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Note:** `.gitignore` prevents committing `dist/`, `release/`, and `build/` folders.

### Step 2: Create Release Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Step 3: GitHub Actions Build (Automatic)

1. GitHub Actions runs on tag push
2. Installs dependencies
3. Generates icons from `public/pwa-512x512.png`
4. Builds web app
5. Builds desktop apps for macOS and Windows
6. Creates GitHub Release with build artifacts

### Step 4: Users Download

Users download from:

```
https://github.com/YOUR_USERNAME/fm-matrix-redesign/releases
```

---

## 🎯 Workflow Summary

```
Source Code (Git)
    ↓
npm run electron:build:all
    ↓
generate-icons.sh (generates build/ folder icons)
    ↓
npm run build (generates dist/ folder)
    ↓
electron-builder (generates release/ folder)
    ↓
GitHub Release (distributes to users)
```

**Important:** Only source code goes to Git. Build artifacts go to GitHub Releases.

---

## 📝 Updating the App Icon

To change the app icon:

1. Replace `public/pwa-512x512.png` with your new icon (512x512 PNG)
2. Commit the change:
   ```bash
   git add public/pwa-512x512.png
   git commit -m "Update app icon"
   git push
   ```
3. Build artifacts will automatically use the new icon

---

## 🔍 File Size Comparison

| What                     | Size    | In Git?      |
| ------------------------ | ------- | ------------ |
| Source code              | ~5 MB   | ✅ Yes       |
| `node_modules/`          | ~500 MB | ❌ No        |
| `dist/`                  | ~30 MB  | ❌ No        |
| `release/`               | ~200 MB | ❌ No        |
| GitHub Release artifacts | ~200 MB | Via Releases |

**Result:** Git repository stays small (~5 MB), distribution happens via GitHub Releases.

---

## 🛠️ Prerequisites

### Local Building (macOS)

- Node.js 18+
- ImageMagick: `brew install imagemagick`

### Local Building (Windows)

- Node.js 18+
- ImageMagick: Download from [imagemagick.org](https://imagemagick.org/script/download.php#windows)

### GitHub Actions

No prerequisites - everything is automated!

---

## ✅ Checklist for Each Release

- [ ] Update version in `package.json`
- [ ] Test locally: `npm run electron:build:mac`
- [ ] Commit source code changes
- [ ] Create and push version tag
- [ ] Wait for GitHub Actions to build
- [ ] Verify release artifacts on GitHub
- [ ] Test downloads

---

## 📚 Key Files

| File                                  | Purpose                | Committed? |
| ------------------------------------- | ---------------------- | ---------- |
| `package.json`                        | Dependencies & scripts | ✅ Yes     |
| `electron/main.js`                    | Electron main process  | ✅ Yes     |
| `generate-icons.sh`                   | Icon generation        | ✅ Yes     |
| `public/pwa-512x512.png`              | Icon source            | ✅ Yes     |
| `build/icon.icns`                     | Generated macOS icon   | ❌ No      |
| `build/icon.ico`                      | Generated Windows icon | ❌ No      |
| `dist/`                               | Web build output       | ❌ No      |
| `release/`                            | Desktop builds         | ❌ No      |
| `.github/workflows/build-desktop.yml` | CI/CD config           | ✅ Yes     |

---

For detailed deployment instructions, see:

- **DEPLOYMENT_QUICK.md** - Quick reference
- **DESKTOP_DEPLOYMENT.md** - Complete guide
