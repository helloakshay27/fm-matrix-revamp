#!/bin/bash
cd /tmp/fm-matrix-redesign

echo "---- Building React Application ----"
npm run build

if [ $? -eq 0 ]; then
    echo "---- Build Completed Successfully ----"
else
    echo "---- Build Failed ----"
    exit 1
fi
