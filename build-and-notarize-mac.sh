#!/bin/bash

# FM Matrix - Mac Build & Notarize Script
# This script automates the complete build and notarization process

set -e  # Exit on error

echo "🚀 FM Matrix macOS Build & Notarization"
echo "========================================"
echo ""

# Check if keychain profile exists
if ! xcrun notarytool history --keychain-profile "fm-matrix-profile" &> /dev/null; then
    echo "❌ Error: Keychain profile 'fm-matrix-profile' not found!"
    echo "Please run the setup first:"
    echo "xcrun notarytool store-credentials \"fm-matrix-profile\" \\"
    echo "  --apple-id \"your@email.com\" \\"
    echo "  --team-id \"YOUR_TEAM_ID\" \\"
    echo "  --password \"xxxx-xxxx-xxxx-xxxx\""
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf release/

# Build the app
echo "🔨 Building macOS app..."
npm run electron:build:mac

# Find the DMG file
DMG_FILE=$(ls release/*.dmg 2>/dev/null | head -n 1)

if [ -z "$DMG_FILE" ]; then
    echo "❌ Error: No DMG file found in release/"
    exit 1
fi

echo "📦 Built: $DMG_FILE"
echo ""

# Notarize the DMG
echo "🔐 Submitting for notarization..."
echo "(This may take 2-5 minutes...)"
xcrun notarytool submit "$DMG_FILE" \
  --keychain-profile "fm-matrix-profile" \
  --wait

echo ""

# Staple the notarization ticket
echo "📌 Stapling notarization ticket..."
xcrun stapler staple "$DMG_FILE"

echo ""

# Verify the signature
echo "✅ Verifying signature..."
codesign --verify --deep --strict --verbose=2 "$DMG_FILE"

echo ""

# Verify Gatekeeper
echo "✅ Verifying Gatekeeper approval..."
spctl -a -t open --context context:primary-signature -v "$DMG_FILE"

echo ""
echo "🎉 Success! Your app is ready for distribution!"
echo "📦 File: $DMG_FILE"
echo ""
echo "You can now distribute this DMG to users."
echo "It will open without any security warnings on macOS."
