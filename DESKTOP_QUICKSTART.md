# 🚀 Quick Start - Desktop Build

## Option 1: Using Build Scripts (Recommended)

### macOS/Linux:

```bash
./build-desktop.sh
```

### Windows:

```cmd
build-desktop.bat
```

Just run the script and select your desired build option from the menu.

## Option 2: Using npm Commands Directly

### Build for macOS (on macOS):

```bash
npm run electron:build:mac
```

### Build for Windows:

```bash
npm run electron:build:win
```

### Build for Both Platforms:

```bash
npm run electron:build:all
```

### Run in Development Mode:

```bash
npm run electron:dev
```

## 📦 Output

All builds are created in the `release/` folder:

- **macOS**: `.dmg` and `.zip` files
- **Windows**: `.exe` installer and `.zip` portable version

## 🎨 Custom App Icon

Before building, add your custom icons:

1. Create `build/icon.icns` for macOS (1024x1024)
2. Create `build/icon.ico` for Windows (256x256)

If icons are missing, the default Electron icon will be used.

## ⚙️ First Time Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the web app:

   ```bash
   npm run build
   ```

3. Build the desktop app:
   ```bash
   npm run electron:build:mac  # or :win or :all
   ```

## 🐛 Troubleshooting

### Cannot find module 'electron'

```bash
npm install
```

### Build fails

Make sure you've built the web app first:

```bash
npm run build
```

### Windows build on macOS requires Wine

Install Wine:

```bash
brew install wine-stable
```

For more detailed information, see [DESKTOP_BUILD_GUIDE.md](DESKTOP_BUILD_GUIDE.md)
