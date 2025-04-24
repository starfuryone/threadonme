#!/bin/bash

# This script initializes a local Git repository, connects it to a GitHub repository,
# and pushes the local files and directory structure to GitHub.

# Exit on error
set -e

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing Git..."
    sudo apt update
    sudo apt install -y git
fi

# Check if user has configured Git
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    echo "Git user configuration missing. Please enter your GitHub username and email."
    read -p "Enter your GitHub username: " github_username
    read -p "Enter your GitHub email: " github_email
    git config --global user.name "$github_username"
    git config --global user.email "$github_email"
fi

# Check if inside a Git repository
if [ ! -d .git ]; then
    echo "Initializing a new Git repository..."
    git init
else
    echo "Existing Git repository found."
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "Creating a .gitignore file with common patterns..."
    cat <<EOL > .gitignore
# Common ignore patterns
node_modules/
dist/
build/
.env
*.log
*.pyc
__pycache__/
EOL
fi

# Stage all files
echo "Staging all files..."
git add .

# Commit changes
echo "Committing files..."
git commit -m "Initial commit of app files and directory structure"

# Check if a remote repository is already set
if ! git remote | grep -q origin; then
    echo "No remote repository set. Please provide the GitHub repository URL."
    echo "Example: https://github.com/username/repository.git"
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
else
    echo "Remote repository already set: $(git remote get-url origin)"
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Sync complete! Your local app files and directory structure are now on GitHub."
