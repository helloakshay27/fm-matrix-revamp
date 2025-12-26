#!/bin/bash
# Generate desktop app icons from the web app icon

echo "🎨 Generating desktop app icons..."

# Create build directory
mkdir -p build

# Copy base PNG
cp public/pwa-512x512.png build/icon.png
echo "✓ Created build/icon.png"

# Generate macOS .icns file
echo "Generating macOS icon..."
mkdir -p build/icon.iconset
for size in 16 32 64 128 256 512; do
  sips -z $size $size public/pwa-512x512.png --out build/icon.iconset/icon_${size}x${size}.png 2>/dev/null
done
for size in 32 64 256 512; do
  half=$((size/2))
  sips -z $size $size public/pwa-512x512.png --out build/icon.iconset/icon_${half}x${half}@2x.png 2>/dev/null
done
iconutil -c icns build/icon.iconset -o build/icon.icns
rm -rf build/icon.iconset
echo "✓ Created build/icon.icns"

# Generate Windows .ico file
if command -v magick &> /dev/null; then
  magick public/pwa-512x512.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
  echo "✓ Created build/icon.ico"
else
  echo "⚠️  ImageMagick not found. Install with: brew install imagemagick"
  echo "   Windows .ico file not created (build will use default icon)"
fi

# Create entitlements file for macOS
cat > build/entitlements.mac.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.allow-dyld-environment-variables</key>
  <true/>
</dict>
</plist>
EOF
echo "✓ Created build/entitlements.mac.plist"

echo "✅ Desktop icons generated successfully!"
echo ""
echo "Build files created in build/ folder:"
ls -lh build/
