#!/bin/bash

# Script to generate PWA icons from SVG
# This script creates PNG icons for the PWA

echo "Generating PWA icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install imagemagick
        else
            echo "Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update && sudo apt-get install -y imagemagick
    else
        echo "Unsupported OS. Please install ImageMagick manually."
        exit 1
    fi
fi

# Generate PNG icons from SVG
cd public

if [ -f "icon-192x192.svg" ]; then
    convert -background none icon-192x192.svg icon-192x192.png
    echo "Created icon-192x192.png"
fi

if [ -f "icon-512x512.svg" ]; then
    convert -background none icon-512x512.svg icon-512x512.png
    echo "Created icon-512x512.png"
fi

echo "✓ PWA icons generated successfully!"
