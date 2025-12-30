# Deployment Fix for MIME Type and Refresh Issues

## Problem

- Module script MIME type errors on production
- Page breaks on refresh (404 errors)
- Assets not loading properly

## Solution

The deployment has been updated with:

1. **Proper nginx configuration** (`nginx.conf`)
   - Configures SPA routing (all routes fallback to index.html)
   - Sets up proper asset caching
   - Handles static file serving correctly

2. **Updated deployment scripts**:
   - `configure_nginx.sh` - Sets up nginx configuration
   - `deploy_build.sh` - Deploys build files to web root
   - `build_react.sh` - Updated build path

3. **Fixed vite.config.ts**:
   - Changed base path from `"./"` to `"/"` for absolute paths
   - Ensures assets are referenced correctly in production

## Deployment Steps

### Option 1: Redeploy via AWS CodeDeploy

```bash
# Commit the changes
git add .
git commit -m "fix: nginx configuration and deployment scripts"
git push origin main

# AWS CodeDeploy will automatically deploy using appspec.yml
```

### Option 2: Manual Server Update

If you have SSH access to the server:

```bash
# 1. Build locally
npm run build

# 2. Copy files to server (adjust paths as needed)
scp -r dist/* user@server:/var/www/fm-matrix/

# 3. Copy nginx config
scp nginx.conf user@server:/etc/nginx/sites-available/fm-matrix

# 4. On the server, create symlink and restart
ssh user@server
sudo ln -sf /etc/nginx/sites-available/fm-matrix /etc/nginx/sites-enabled/fm-matrix
sudo nginx -t
sudo systemctl restart nginx
```

## What Changed

### nginx.conf

- Added proper SPA routing with `try_files $uri $uri/ /index.html`
- Configured asset caching for performance
- Set up proper MIME types and compression

### appspec.yml

- Added deployment hooks for:
  - Deploying build files
  - Configuring nginx
  - Restarting nginx

### vite.config.ts

- Changed base path to use absolute paths (`"/"`) instead of relative (`"./"`)
- This ensures all assets load correctly from root

## Verification

After deployment:

1. Visit https://dev-fm-matrix.lockated.com
2. Navigate to any route (e.g., /maintenance/asset)
3. Refresh the page - it should work without errors
4. Check browser console - no MIME type errors

## Troubleshooting

If issues persist:

```bash
# On server, check nginx logs
sudo tail -f /var/log/nginx/error.log

# Check if files exist
ls -la /var/www/fm-matrix/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```
