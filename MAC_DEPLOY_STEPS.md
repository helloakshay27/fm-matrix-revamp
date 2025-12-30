# 🚀 FM Matrix - macOS Deployment Steps

## ✅ Pre-requisites Checklist

Before you start, ensure you have:

- [ ] macOS system (Ventura or later)
- [ ] Xcode Command Line Tools installed
- [ ] Apple Developer Account (Paid - ₹8,000/year)
- [ ] Node.js and npm installed
- [ ] All dependencies installed (`npm install`)

---

## 📋 Step-by-Step Deployment Process

### 1️⃣ Install Xcode Command Line Tools (if not already)

```bash
xcode-select --install
```

---

### 2️⃣ Apple Developer Account Setup

#### A. Create Certificates

1. Go to: [Apple Developer - Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Create these certificates:
   - **Developer ID Application** (for code signing)
   - **Developer ID Installer** (for installer packages)
3. Download both certificates
4. Double-click each certificate → Install to **Keychain Access**

#### B. Create App Identifier

1. Go to: [Identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Click **+** to create new identifier
3. Select **App IDs** → Continue
4. Bundle ID: `com.fmmatrix.desktop` (must match electron-builder.json)
5. Description: `FM Matrix Desktop App`
6. Click **Continue** → **Register**

---

### 3️⃣ Get Your Team ID

1. Go to: [Apple Developer Membership](https://developer.apple.com/account/#/membership)
2. Copy your **Team ID** (10-character string)
3. Update in `electron-builder.json`:

```json
"notarize": {
  "teamId": "2LPKRDF37L"
}
```

---

### 4️⃣ Generate App-Specific Password

1. Go to: [Apple ID Account](https://appleid.apple.com/account/manage)
2. Navigate to **Security** → **App-Specific Passwords**
3. Click **Generate Password**
4. Label: `FM Matrix Notarization`
5. **Save this password securely** - you'll need it for notarization

---

### 5️⃣ Store Apple Credentials for Notarization

```bash
xcrun notarytool store-credentials "fm-matrix-profile" \
  --apple-id "your@email.com" \
  --team-id "YOUR_TEAM_ID" \
  --password "xxxx-xxxx-xxxx-xxxx"
```

Replace:

- `your@email.com` - Your Apple ID email
- `YOUR_TEAM_ID` - Your actual Team ID
- `xxxx-xxxx-xxxx-xxxx` - The app-specific password you generated

---

### 6️⃣ Build the macOS App

```bash
# Clean previous builds
rm -rf release/

# Build for macOS
npm run electron:build:mac
```

This will create:

```
release/
 ├── FM Matrix-1.0.0.dmg
 ├── FM Matrix-1.0.0-mac.zip
 └── FM Matrix-1.0.0-arm64-mac.zip
```

---

### 7️⃣ Notarize the DMG

```bash
# Submit for notarization
xcrun notarytool submit "release/FM Matrix-1.0.0.dmg" \
  --keychain-profile "fm-matrix-profile" \
  --wait

# Check status (optional)
xcrun notarytool history \
  --keychain-profile "fm-matrix-profile"
```

Wait for Apple's response (usually 2-5 minutes).

---

### 8️⃣ Staple the Notarization Ticket

```bash
xcrun stapler staple "release/FM Matrix-1.0.0.dmg"
```

Output should show: `The staple and validate action worked!`

---

### 9️⃣ Verify the App

```bash
# Verify signature
codesign --verify --deep --strict --verbose=2 "release/FM Matrix-1.0.0.dmg"

# Check notarization
spctl -a -t open --context context:primary-signature -v "release/FM Matrix-1.0.0.dmg"
```

✅ You should see: `accepted`

---

## 🎉 Distribution Ready!

Your app is now ready to distribute:

- ✅ **FM Matrix-1.0.0.dmg** - Recommended for distribution
- ✅ **FM Matrix-1.0.0-mac.zip** - Alternative format

Users can now install without any Gatekeeper warnings!

---

## 🔧 Troubleshooting

### ❌ Error: "Developer cannot be verified"

**Solution:**

- Check certificates are installed in Keychain Access
- Ensure `CSC_IDENTITY_AUTO_DISCOVERY=true` is set
- Rebuild the app

### ❌ Error: "App is damaged and can't be opened"

**Solution:**

- App was not notarized properly
- Run steps 7-8 again (notarize + staple)

### ❌ Build fails with code signing error

**Solution:**

```bash
# Check available certificates
security find-identity -v -p codesigning

# Set environment variable
export CSC_IDENTITY_AUTO_DISCOVERY=true

# Rebuild
npm run electron:build:mac
```

### ❌ Notarization fails

**Solution:**

1. Check your Apple ID and Team ID are correct
2. Verify app-specific password is valid
3. Check notarization logs:

```bash
xcrun notarytool log SUBMISSION_ID \
  --keychain-profile "fm-matrix-profile"
```

---

## 📦 Quick Build Script

Create a file `build-and-notarize-mac.sh`:

```bash
#!/bin/bash

# FM Matrix - Mac Build & Notarize Script

echo "🚀 Starting FM Matrix macOS build..."

# Clean
rm -rf release/

# Build
npm run electron:build:mac

# Get the DMG name
DMG_FILE=$(ls release/*.dmg | head -n 1)

echo "📦 Built: $DMG_FILE"

# Notarize
echo "🔐 Notarizing..."
xcrun notarytool submit "$DMG_FILE" \
  --keychain-profile "fm-matrix-profile" \
  --wait

# Staple
echo "📌 Stapling..."
xcrun stapler staple "$DMG_FILE"

# Verify
echo "✅ Verifying..."
spctl -a -t open --context context:primary-signature -v "$DMG_FILE"

echo "🎉 Done! Ready for distribution: $DMG_FILE"
```

Make it executable:

```bash
chmod +x build-and-notarize-mac.sh
```

Run it:

```bash
./build-and-notarize-mac.sh
```

---

## 🔄 Next Steps

### Optional Enhancements:

1. **Auto-updates** - Add electron-updater
2. **CI/CD** - Set up GitHub Actions for automated builds
3. **Windows Build** - Use same setup for Windows signing
4. **Optimize Size** - Remove unnecessary dependencies

---

## 📞 Support

If you encounter issues:

1. Check the [Electron Builder Docs](https://www.electron.build/code-signing)
2. Review [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
3. Check electron-builder logs in `release/builder-debug.yml`

---

**Last Updated:** 29 December 2025
**Version:** 1.0.0
**Built for:** macOS (x64 & arm64)
