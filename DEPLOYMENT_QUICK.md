# 🚀 Quick Deployment Steps

## Manual Release (Simple & Fast)

### 1. Build Locally

```bash
npm run electron:build:all
```

### 2. Create Version Tag

```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

### 3. Create GitHub Release

1. Go to GitHub → Your Repo → Releases → "Create a new release"
2. Select tag: `v1.0.0`
3. Upload files from `release/` folder:
   - ✅ `FM Matrix-0.0.0.dmg` (macOS Intel)
   - ✅ `FM Matrix-0.0.0-arm64.dmg` (macOS Apple Silicon)
   - ✅ `FM Matrix Setup 0.0.0.exe` (Windows)
   - ✅ `FM Matrix-0.0.0-win.zip` (Windows portable)
4. Click "Publish release"

**Done!** Users download from: `github.com/YOUR_USERNAME/fm-matrix-redesign/releases`

---

## Automated Release (GitHub Actions)

### Setup Once

Already configured! The workflow file is at:
`.github/workflows/build-desktop.yml`

### Every Release

```bash
# Update version in package.json first!
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin v1.0.0
```

**Done!** GitHub automatically builds and creates the release.

---

## 📋 Pre-Release Checklist

- [ ] Update `"version": "1.0.0"` in package.json
- [ ] Test locally: `npm run electron:build:mac`
- [ ] Commit all changes
- [ ] Create and push version tag
- [ ] Wait for builds or upload manually
- [ ] Test download links

---

## 🎯 Version Numbering

Use semantic versioning:

- `1.0.0` - Major release (breaking changes)
- `1.1.0` - Minor release (new features)
- `1.0.1` - Patch release (bug fixes)
- `1.0.0-beta.1` - Pre-release/beta

---

## 📁 What Gets Committed?

✅ **Commit these:**

- Source code (`src/`, `electron/`, etc.)
- Configuration files
- Icons (`build/icon.icns`, `build/icon.ico`)
- Documentation
- GitHub Actions workflows

❌ **Don't commit:**

- `release/` folder (in .gitignore)
- `.dmg`, `.exe`, `.zip` files
- `node_modules/`
- `dist/`

---

## 🔗 Share With Users

After release, share this link:

```
https://github.com/YOUR_USERNAME/fm-matrix-redesign/releases/latest
```

Or specific version:

```
https://github.com/YOUR_USERNAME/fm-matrix-redesign/releases/tag/v1.0.0
```

---

## 🆘 Quick Fixes

### "Missing script" error

```bash
npm install
```

### Build files too large

Use GitHub Releases (files up to 2GB each)

### Users can't open on macOS

Tell users to run:

```bash
xattr -cr "/Applications/FM Matrix.app"
```

Or implement code signing (see DESKTOP_DEPLOYMENT.md)

---

For detailed instructions, see **DESKTOP_DEPLOYMENT.md**
