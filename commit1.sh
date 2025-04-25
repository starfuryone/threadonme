#!/bin/bash

# Script to commit and push changes to the threadonme repository

# Repository URL
REPO_URL="https://github.com/starfuryone/threadonme.git"
REPO_DIR="$HOME/puppeteer-test"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed. Please install Git using 'sudo apt install git'."
    exit 1
fi

# Check if the repository directory exists
if [ ! -d "$REPO_DIR" ]; then
    echo "Error: Directory $REPO_DIR does not exist. Please clone the repository or check the path."
    exit 1
fi

# Navigate to the repository directory
cd "$REPO_DIR" || { echo "Error: Could not navigate to $REPO_DIR"; exit 1; }

# Check if the directory is a Git repository
if [ ! -d ".git" ]; then
    echo "Error: $REPO_DIR is not a Git repository. Please initialize it with 'git init' or clone the repository."
    exit 1
fi

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit."
    exit 0
fi

# Prompt for a commit message
read -p "Enter commit message: " COMMIT_MESSAGE
if [ -z "$COMMIT_MESSAGE" ]; then
    echo "Error: Commit message cannot be empty."
    exit 1
fi

# Add all changes
echo "Adding changes..."
git add . || { echo "Error: Failed to add changes"; exit 1; }

# Commit changes
echo "Committing changes..."
git commit -m "$COMMIT_MESSAGE" || { echo "Error: Failed to commit changes"; exit 1; }

# Push to the main branch
echo "Pushing to $REPO_URL..."
git push -u origin main || { echo "Error: Failed to push to repository. Check your credentials or network."; exit 1; }

echo "Successfully committed and pushed changes to $REPO_URL!"
