#!/bin/bash

# This script uploads files and directory structure to a GitHub repository.
# It initializes a Git repository, configures authentication, and pushes to GitHub.

# Exit on error
set -e

# Default repository URL (modify as needed)
REPO_URL="https://github.com/starfuryone/threadonme.git"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing Git..."
    sudo apt update
    sudo apt install -y git
fi

# Check if user has configured Git
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    echo "Configuring Git user..."
    git config --global user.name "starfuryone"
    git config --global user.email "fredericd@gmail.com"
fi

# Prompt for Personal Access Token
echo "Please enter your GitHub Personal Access Token (PAT):"
read -s PAT
if [ -z "$PAT" ]; then
    echo "Error: PAT cannot be empty."
    exit 1
fi

# Initialize Git repository if not already initialized
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

# Commit changes if there are staged files
if git status --porcelain | grep -q .; then
    echo "Committing files..."
    git commit -m "Upload files and directory structure"
else
    echo "No changes to commit."
fi

# Ensure the branch is 'main'
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    echo "No branch detected. Creating 'main' branch..."
    git checkout -b main
elif [ "$current_branch" != "main" ]; then
    echo "Renaming branch '$current_branch' to 'main'..."
    git branch -m "$current_branch" main
fi

# Set up remote repository
if ! git remote | grep -q origin; then
    echo "Setting remote repository to $REPO_URL..."
    git remote add origin "$REPO_URL"
else
    echo "Remote repository already set: $(git remote get-url origin)"
    git remote set-url origin "$REPO_URL"
fi

# Configure credential helper to avoid repeated PAT entry
git config credential.helper store
echo "https://starfuryone:$PAT@github.com" > ~/.git-credentials

# Push to GitHub
echo "Pushing to GitHub..."
if git push -u origin main; then
    echo "Successfully pushed to $REPO_URL!"
else
    echo "Push failed. Checking for remote branch conflicts..."
    git fetch origin
    if git ls-remote --exit-code origin refs/heads/main > /dev/null 2>&1; then
        echo "Remote 'main' branch exists. Attempting to pull and rebase..."
        if git pull origin main --rebase; then
            git push -u origin main
            echo "Successfully pushed after rebasing!"
        else
            echo "Error: Pull and rebase failed. Consider forcing the push (warning: overwrites remote history):"
            read -p "Force push? (y/N): " force_push
            if [ "$force_push" = "y" ] || [ "$force_push" = "Y" ]; then
                git push -f origin main
                echo "Force pushed to $REPO_URL!"
            else
                echo "Aborted. Please resolve conflicts manually."
                exit 1
            fi
        fi
    else
        echo "Error: Push failed. Check your PAT permissions or repository access."
        exit 1
    fi
fi

# Clean up credentials file for security
rm -f ~/.git-credentials
git config --unset credential.helper

echo "Upload complete! Files and directory structure are now on GitHub."
