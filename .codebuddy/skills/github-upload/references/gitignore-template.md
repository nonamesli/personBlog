# Gitignore 模板 - Node.js / React 项目
# 上传前确保项目包含此文件，避免上传不必要的文件

# 依赖目录
node_modules/
.pnp
.pnp.js

# 构建输出
dist/
build/
*.local

# 环境变量和敏感文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器和 IDE
.idea/
.vscode/
*.swp
*.swo
*~
.DS_Store

# 临时文件
*.tmp
*.temp
.cache/

# 测试覆盖率
coverage/
.nyc_output/

# 日志
logs/
*.log

# Git 凭证（绝不能上传！）
.git-credentials

# OS 文件
Thumbs.db
Desktop.ini

# CodeBuddy 内部（可选不上传）
.codebuddy/
