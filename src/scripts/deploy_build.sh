#!/bin/bash

echo "---- Deploying Build Files ----"

# Copy build files to web root
rm -rf /var/www/fm-matrix/*
cp -r /tmp/fm-matrix-redesign/dist/* /var/www/fm-matrix/

# Set proper permissions
chown -R www-data:www-data /var/www/fm-matrix
chmod -R 755 /var/www/fm-matrix

echo "---- Build Files Deployed ----"
