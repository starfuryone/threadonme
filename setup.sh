#!/bin/bash

echo "🚀 Starting setup on $(hostname)..."

APP_DIR="/home/starfury/dev/puppeteer-test"

mkdir -p "$APP_DIR"
cd "$APP_DIR" || { echo "❌ Failed to cd into $APP_DIR"; exit 1; }

apt-get update -y
apt-get install -y curl git build-essential unzip

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

node -v
npm -v

if [ ! -c /dev/null ]; then
    rm -f /dev/null
    mknod -m 666 /dev/null c 1 3
    chown root:root /dev/null
fi

apt-get install -y chromium-browser || apt-get install -y chromium

npm install

echo "✅ Setup complete in $APP_DIR"
echo "➡️ Run manually with: node bots/thread-bot.mjs"
