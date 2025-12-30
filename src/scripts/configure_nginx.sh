#!/bin/bash

echo "---- Configuring NGINX ----"

# Create web root directory if it doesn't exist
mkdir -p /var/www/fm-matrix

# Copy nginx configuration
cp /tmp/fm-matrix-redesign/nginx.conf /etc/nginx/sites-available/fm-matrix

# Create symlink if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/fm-matrix ]; then
    ln -s /etc/nginx/sites-available/fm-matrix /etc/nginx/sites-enabled/fm-matrix
fi

# Remove default nginx site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "NGINX configuration is valid"
else
    echo "NGINX configuration test failed"
    exit 1
fi

echo "---- NGINX Configured Successfully ----"
