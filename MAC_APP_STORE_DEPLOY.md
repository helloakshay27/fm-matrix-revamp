# 🍎 FM Matrix - Mac App Store Deployment Guide

Complete guide to deploy FM Matrix to the Mac App Store.

---

## 🔑 Prerequisites

- ✅ Apple Developer Account (Paid - ₹8,000/year)
- ✅ App Store Connect access
- ✅ macOS with Xcode installed
- ✅ Valid App ID and certificates

---

## 📋 Step-by-Step Deployment

### 1️⃣ Create App Store Certificates

Go to: [Apple Developer - Certificates](https://developer.apple.com/account/resources/certificates/list)

Create these certificates:

#### A. Mac App Distribution Certificate

1. Click **+** → Select **Mac App Distribution**
2. Follow the CSR generation process
3. Download and install in **Keychain Access**

#### B. Mac Installer Distribution Certificate

1. Click **+** → Select **Mac Installer Distribution**
2. Follow the CSR generation process
3. Download and install in **Keychain Access**

---

### 2️⃣ Create App Store Identifier

1. Go to: [Identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Click **+** → Select **App IDs** → Continue
3. **Bundle ID**: `com.fmmatrix.desktop` (must be unique)
4. **Description**: `FM Matrix - Facility Management`
5. Enable capabilities (if needed):
   - App Sandbox ✅ (Required for Mac App Store)
   - Network ✅ (if your app needs internet)
6. Click **Continue** → **Register**

---

### 3️⃣ Create Provisioning Profile

1. Go to: [Profiles](https://developer.apple.com/account/resources/profiles/list)
2. Click **+** → Select **Mac App Store**
3. Select your App ID: `com.fmmatrix.desktop`
4. Select your **Mac App Distribution** certificate
5. Name: `FM Matrix Mac App Store`
6. Download the profile
7. Double-click to install

---

### 4️⃣ Create App in App Store Connect

1. Go to: [App Store Connect](https://appstoreconnect.apple.com/apps)
2. Click **+** → **New App**
3. Fill in details:
   - **Platform**: macOS
   - **Name**: FM Matrix
   - **Primary Language**: English
   - **Bundle ID**: `com.fmmatrix.desktop`
   - **SKU**: `FMMATRIX-001` (unique identifier)
4. Click **Create**

---

### 5️⃣ Update electron-builder Configuration

Create `electron-builder-mas.json`:

```json
{
  "appId": "com.fmmatrix.desktop",
  "productName": "FM Matrix",
  "copyright": "Copyright © 2025 Haven Info Line",
  "directories": {
    "output": "release",
    "buildResources": "build"
  },
  "files": ["dist/**/*", "electron/**/*", "package.json"],
  "mac": {
    "target": [
      {
        "target": "mas",
        "arch": ["x64", "arm64"]
      }
    ],
    "icon": "build/icon.icns",
    "category": "public.app-category.business",
    "hardenedRuntime": false,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mas.plist",
    "entitlementsInherit": "build/entitlements.mas.inherit.plist",
    "provisioningProfile": "build/embedded.provisionprofile",
    "type": "distribution"
  },
  "mas": {
    "entitlements": "build/entitlements.mas.plist",
    "entitlementsInherit": "build/entitlements.mas.inherit.plist",
    "provisioningProfile": "build/embedded.provisionprofile",
    "hardenedRuntime": false,
    "type": "distribution"
  }
}
```

---

### 6️⃣ Create Mac App Store Entitlements

#### A. Main Entitlements (`build/entitlements.mas.plist`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- App Sandbox (Required for Mac App Store) -->
  <key>com.apple.security.app-sandbox</key>
  <true/>

  <!-- Network Access -->
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.network.server</key>
  <true/>

  <!-- File Access -->
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
  <key>com.apple.security.files.downloads.read-write</key>
  <true/>

  <!-- Temporary Exception (for compatibility) -->
  <key>com.apple.security.temporary-exception.apple-events</key>
  <string>com.apple.systemevents</string>
</dict>
</plist>
```

#### B. Inherit Entitlements (`build/entitlements.mas.inherit.plist`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.app-sandbox</key>
  <true/>
  <key>com.apple.security.inherit</key>
  <true/>
</dict>
</plist>
```

---

### 7️⃣ Copy Provisioning Profile

```bash
# Copy the provisioning profile you downloaded
cp ~/Downloads/FM_Matrix_Mac_App_Store.provisionprofile build/embedded.provisionprofile
```

---

### 8️⃣ Add Build Script to package.json

```json
{
  "scripts": {
    "electron:build:mas": "npm run generate-icons && npm run build && electron-builder --config electron-builder-mas.json --mac mas"
  }
}
```

---

### 9️⃣ Build for Mac App Store

```bash
# Clean previous builds
rm -rf release/

# Build for Mac App Store
npm run electron:build:mas
```

This will create:

```
release/
 ├── FM Matrix-1.0.0.pkg         (Universal - x64 + arm64)
 └── mas/
     └── FM Matrix.app
```

---

### 🔟 Upload to App Store Connect

#### Option 1: Using Transporter App (Recommended)

1. Download **Transporter** from Mac App Store
2. Open Transporter
3. Click **+** or drag `FM Matrix-1.0.0.pkg`
4. Click **Deliver**
5. Wait for upload to complete

#### Option 2: Using Command Line

```bash
# Install xcrun altool (if not already installed)
xcrun altool --upload-app \
  --type osx \
  --file "release/FM Matrix-1.0.0.pkg" \
  --username "havenappstore@gmail.com" \
  --password "@keychain:AC_PASSWORD"
```

**Note**: Store your App Store Connect password in Keychain:

```bash
xcrun altool --store-password-in-keychain-item "AC_PASSWORD" \
  -u "havenappstore@gmail.com" \
  -p "your-app-specific-password"
```

---

### 1️⃣1️⃣ Complete App Store Connect Information

Go to [App Store Connect](https://appstoreconnect.apple.com/)

#### A. App Information

1. Select your app → **App Information**
2. Fill in:
   - **Category**: Business or Productivity
   - **Subcategory**: (optional)
   - **Privacy Policy URL**: Your privacy policy URL

#### B. Pricing and Availability

1. Click **Pricing and Availability**
2. Set price (Free or Paid)
3. Select territories/regions

#### C. Prepare for Submission

1. Click **+ Version** → Create new version (e.g., 1.0.0)
2. Fill in required fields:
   - **What's New**: Describe features
   - **Description**: Full app description
   - **Keywords**: facility, management, tickets, assets
   - **Support URL**: Your support website
   - **Marketing URL**: (optional)

#### D. Screenshots (Required)

You need screenshots for:

- 1280 x 800 pixels (minimum)
- 1440 x 900 pixels (recommended)
- 2880 x 1800 pixels (Retina)

Take 3-5 screenshots of your app.

#### E. App Icon

- 1024 x 1024 pixels (PNG, no transparency)

---

### 1️⃣2️⃣ Submit for Review

1. Go to **App Store** tab
2. Select the build you uploaded
3. Fill in **Export Compliance Information**
4. Fill in **Advertising Identifier** (usually No)
5. Click **Save**
6. Click **Submit for Review**

---

### 1️⃣3️⃣ Review Process

- Apple will review your app (usually 1-3 days)
- You'll receive emails about the status
- If rejected, fix issues and resubmit
- If approved, your app goes live automatically (or on scheduled date)

---

## 🔄 Quick Build & Upload Script

Create `build-and-upload-mas.sh`:

```bash
#!/bin/bash

echo "🍎 Building FM Matrix for Mac App Store..."

# Clean
rm -rf release/

# Build
npm run electron:build:mas

# Check if build succeeded
if [ ! -f "release/FM Matrix-1.0.0.pkg" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build complete!"
echo ""
echo "📦 Package: release/FM Matrix-1.0.0.pkg"
echo ""
echo "Next steps:"
echo "1. Open Transporter app"
echo "2. Drag 'release/FM Matrix-1.0.0.pkg' into Transporter"
echo "3. Click 'Deliver'"
echo "4. Complete submission in App Store Connect"
```

Make it executable:

```bash
chmod +x build-and-upload-mas.sh
```

---

## 🔧 Common Issues & Solutions

### ❌ "Invalid Code Signing Entitlements"

**Solution**: Make sure `com.apple.security.app-sandbox` is set to `true` in entitlements.

### ❌ "Missing Provisioning Profile"

**Solution**: Download the correct provisioning profile and place in `build/embedded.provisionprofile`

### ❌ "Invalid Bundle Structure"

**Solution**: Electron-builder should handle this. Make sure all files are in `dist/` folder.

### ❌ App Sandbox Violations

**Solution**: Review entitlements and ensure your app complies with App Sandbox restrictions. You may need to request specific entitlements.

---

## 📊 Comparison: Developer ID vs Mac App Store

| Feature         | Developer ID (Current)       | Mac App Store            |
| --------------- | ---------------------------- | ------------------------ |
| Distribution    | Direct download from website | Only through App Store   |
| Approval        | Instant (notarization only)  | 1-3 days review          |
| Updates         | Manual                       | Through App Store        |
| Sandbox         | Optional                     | **Required**             |
| Restrictions    | Minimal                      | Strict (no private APIs) |
| Discoverability | SEO, marketing               | App Store search         |
| Revenue Share   | 0%                           | 15-30% to Apple          |

---

## 💡 Recommendations

### For FM Matrix:

**Developer ID (Current Setup)** is better if:

- ✅ You want to distribute directly from your website
- ✅ Need full system access (no sandbox)
- ✅ Want faster updates
- ✅ Keep 100% revenue
- ✅ Target enterprise customers

**Mac App Store** is better if:

- ✅ You want App Store visibility
- ✅ Target consumer market
- ✅ Want automatic updates through App Store
- ✅ Don't need unrestricted system access

### Suggested Approach:

**Offer both!**

1. **Developer ID version** - Full-featured, on your website
2. **Mac App Store version** - Sandbox-compliant, in App Store

This gives users choice and maximizes reach.

---

## 📞 Additional Resources

- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Mac App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Sandbox Documentation](https://developer.apple.com/documentation/security/app_sandbox)
- [Electron Mac App Store Guide](https://www.electron.build/configuration/mac#mas)

---

**Last Updated:** 29 December 2025
**Your Current Status:** ✅ Developer ID build complete and ready
**Next Step:** Follow this guide if you want Mac App Store distribution
