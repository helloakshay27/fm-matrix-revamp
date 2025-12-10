#!/bin/bash
cd 
cd /var/www/html/uat/fm-matrix-revamp
sudo git pull 

echo "---- Installing Dependencies ----"
npm ci --legacy-peer-deps
