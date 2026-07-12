#!/bin/bash
# GitHub 代码上传脚本
# 用法: ./scripts/upload.sh <username> <password/token> <repo-name> [description] [public/private]

set -e

USERNAME="$1"
PASSWORD="$2"
REPO_NAME="$3"
DESCRIPTION="${4:-My project uploaded via CodeBuddy}"
VISIBILITY="${5:-private}"  # 默认私有

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$REPO_NAME" ]; then
    echo "Usage: $0 <username> <password/token> <repo-name> [description] [public|private]"
    exit 1
fi

# 配置 Git 凭证
echo "Configuring Git credentials..."
git config --global credential.helper store
echo "https://${USERNAME}:${PASSWORD}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# 检查是否已有 Git 仓库
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
else
    echo "Git repository already exists."
fi

# 创建 GitHub 仓库
echo "Creating GitHub repository: ${REPO_NAME}..."
IS_PRIVATE="true"
if [ "$VISIBILITY" = "public" ]; then
    IS_PRIVATE="false"
fi

RESPONSE=$(curl -s -u "${USERNAME}:${PASSWORD}" https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO_NAME}\",\"description\":\"${DESCRIPTION}\",\"private\":${IS_PRIVATE}}")

# 检查是否创建成功
if echo "$RESPONSE" | grep -q '"html_url"'; then
    REPO_URL=$(echo "$RESPONSE" | grep -o '"html_url": "[^"]*' | cut -d'"' -f4)
    echo "Repository created: ${REPO_URL}"
else
    echo "Failed to create repository:"
    echo "$RESPONSE"
    exit 1
fi

# 关联远程仓库并推送
echo "Pushing code to GitHub..."

# 检查是否已有远程 origin
if git remote get-url origin &>/dev/null; then
    git remote set-url origin "https://github.com/${USERNAME}/${REPO_NAME}.git"
else
    git remote add origin "https://github.com/${USERNAME}/${REPO_NAME}.git"
fi

git branch -M main
git push -u origin main

echo ""
echo "=========================================="
echo "Upload completed successfully!"
echo "Repository URL: ${REPO_URL}"
echo "=========================================="
