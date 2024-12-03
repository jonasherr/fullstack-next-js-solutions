#!/bin/bash

# Get the current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Deleting all tags associated with the branch '$CURRENT_BRANCH'..."

# 1. Delete all local tags
LOCAL_TAGS=$(git tag)
if [ -n "$LOCAL_TAGS" ]; then
  git tag -d $(git tag)
  echo "Deleted all local tags."
else
  echo "No local tags to delete."
fi

# 2. Delete all remote tags in parallel
# Filter valid remote tag names only, exclude '^{}' or other invalid patterns
REMOTE_TAGS=$(git ls-remote --tags origin | grep -v '\^{}' | awk '{print $2}' | sed 's|refs/tags/||')

if [ -n "$REMOTE_TAGS" ]; then
  echo "$REMOTE_TAGS" | xargs -P10 -n1 -I {} git push --delete origin {} >/dev/null 2>&1 && echo "Deleted remote tags in parallel."
else
  echo "No remote tags to delete."
fi

# Function to convert a string to kebab case
to_kebab_case() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g'
}

echo "Processing commits and generating tag names..."

# 3. Get the list of commits and build an array of tag names
declare -a TAGS_TO_CREATE
COMMITS=$(git log --pretty=format:"%H %s")

while read -r line; do
  COMMIT_HASH=$(echo "$line" | awk '{print $1}')   # Extract the commit hash
  COMMIT_MSG=$(echo "$line" | cut -d' ' -f2-)     # Extract the commit message
  
  TAG_NAME=$(to_kebab_case "$COMMIT_MSG")         # Convert message to kebab case
  
  # Store the tag details for batch creation
  TAGS_TO_CREATE+=("$TAG_NAME:$COMMIT_HASH")
done <<< "$COMMITS"

# 4. Create all tags locally
echo "Creating tags locally..."
for TAG_INFO in "${TAGS_TO_CREATE[@]}"; do
  TAG_NAME=${TAG_INFO%%:*}
  COMMIT_HASH=${TAG_INFO##*:}
  
  if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
    echo "Tag '$TAG_NAME' already exists. Skipping."
  else
    git tag -a "$TAG_NAME" "$COMMIT_HASH" -m "$TAG_NAME"
    echo "Created tag '$TAG_NAME' for commit $COMMIT_HASH."
  fi
done

# 5. Push all tags to remote in bulk
echo "Pushing all tags to remote..."
git push --tags

echo "Tagging complete!"
