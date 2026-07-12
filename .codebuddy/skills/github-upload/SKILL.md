---
name: github-upload
description: 用于将本地项目代码上传到 GitHub 仓库。支持使用账号密码登录 GitHub、创建新仓库或推送到现有仓库。当用户要求上传代码、推送代码到 GitHub、发布项目到 GitHub 时触发此 skill。
---

# GitHub 代码上传 Skill

## 概述
此 skill 提供将本地项目代码上传到 GitHub 仓库的完整流程，包括：
- 使用账号密码登录 GitHub（通过 git credential 配置）
- 创建新的 GitHub 仓库（通过 GitHub API）
- 初始化 Git 仓库并提交代码
- 推送代码到远程仓库

## 前置条件
- 用户需要提供 GitHub 账号和密码（或 Personal Access Token）
- 本地已安装 Git
- 项目目录下可以初始化 Git 仓库

## 工作流程

### 第一步：获取用户凭证
向用户询问以下信息：
1. **GitHub 用户名** - GitHub 账号用户名
2. **GitHub 密码或 Token** - 密码或 Personal Access Token（推荐使用 Token，更安全）
3. **仓库名称** - 要创建/使用的仓库名称（默认使用当前文件夹名）
4. **仓库描述**（可选）- 仓库的简要描述
5. **是否公开**（可选）- 默认为私有仓库

### 第二步：配置 Git 凭证
运行以下命令配置 Git 凭证（在项目根目录执行）：

```bash
git config --global credential.helper store
echo "https://USERNAME:PASSWORD@github.com" > ~/.git-credentials
```

> **注意**：`USERNAME` 和 `PASSWORD` 替换为用户提供的实际凭证。

### 第三步：检查/初始化 Git 仓库
检查当前项目是否已有 Git 仓库：

```bash
git status
```

如果没有 Git 仓库，则初始化：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 第四步：创建 GitHub 远程仓库
使用 GitHub API 创建远程仓库：

```bash
curl -u "USERNAME:PASSWORD" https://api.github.com/user/repos \
  -d '{"name":"REPO_NAME","description":"DESCRIPTION","private":true}'
```

> 参数说明：
> - `REPO_NAME`: 仓库名称
> - `DESCRIPTION`: 仓库描述
> - `private`: true 为私有，false 为公开

### 第五步：关联并推送代码
将本地仓库与远程仓库关联并推送：

```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 注意事项

1. **安全提醒**：建议用户使用 Personal Access Token 而非密码。Token 可在 GitHub Settings > Developer settings > Personal access tokens 中生成，需要 `repo` 权限。
2. **.gitignore**：确保项目中有 `.gitignore` 文件，排除 `node_modules`、`.env` 等敏感或不必要的文件。
3. **大文件**：如果项目包含大文件（>100MB），需要先配置 Git LFS。
4. **已有远程仓库**：如果用户想推送到现有仓库，跳过第四步，直接让用户提供仓库 URL。

## 错误处理

| 错误 | 解决方案 |
|------|----------|
| Authentication failed | 检查用户名密码/Token 是否正确 |
| Repository already exists | 询问用户是否推送到现有仓库 |
| push rejected | 先执行 `git pull --rebase origin main` 再 push |
| SSL certificate problem | 运行 `git config --global http.sslverify false`（仅用于测试） |

## 示例用法

用户说："帮我把这个项目上传到 GitHub"

执行步骤：
1. 询问用户名、密码、仓库名等信息
2. 配置凭证
3. 初始化 Git 并提交
4. 通过 API 创建仓库
5. 推送代码
6. 输出仓库 URL 给用户
