#!/bin/bash

echo "🚀 FM Matrix Desktop Builder"
echo "=============================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build menu
echo "Select build target:"
echo "1) macOS (current platform)"
echo "2) Windows"
echo "3) Both macOS and Windows"
echo "4) Development mode"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🍎 Building for macOS..."
        npm run electron:build:mac
        ;;
    2)
        echo ""
        echo "🪟 Building for Windows..."
        echo "Note: Building Windows on macOS requires Wine"
        npm run electron:build:win
        ;;
    3)
        echo ""
        echo "🌍 Building for all platforms..."
        echo "Note: Building Windows on macOS requires Wine"
        npm run electron:build:all
        ;;
    4)
        echo ""
        echo "🔧 Starting in development mode..."
        npm run electron:dev
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

if [ $choice -ne 4 ]; then
    echo ""
    echo "✅ Build complete!"
    echo "📁 Check the 'release' folder for your builds"
fi
