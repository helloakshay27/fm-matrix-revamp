#!/bin/bash
cd /var/www/html/development/fm-matrix-revamp
sudo git pull 

echo "---- Installing Dependencies ----"
npm ci --legacy-peer-deps
