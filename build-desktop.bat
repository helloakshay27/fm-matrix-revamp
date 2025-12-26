@echo off
echo ================================
echo FM Matrix Desktop Builder
echo ================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Select build target:
echo 1) Windows (current platform)
echo 2) macOS
echo 3) Both Windows and macOS
echo 4) Development mode
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo Building for Windows...
    call npm run electron:build:win
) else if "%choice%"=="2" (
    echo.
    echo Building for macOS...
    echo Note: Building macOS on Windows requires special setup
    call npm run electron:build:mac
) else if "%choice%"=="3" (
    echo.
    echo Building for all platforms...
    call npm run electron:build:all
) else if "%choice%"=="4" (
    echo.
    echo Starting in development mode...
    call npm run electron:dev
) else (
    echo Invalid choice
    exit /b 1
)

if not "%choice%"=="4" (
    echo.
    echo Build complete!
    echo Check the 'release' folder for your builds
)

pause
