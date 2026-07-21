---
name: blog-deploy
description: 用于将博客项目部署到远程服务器。支持前端代码打包、上传到服务器，以及可选的后端代码上传。当用户要求"部署"、"上传服务器"、"发布到服务器"、"打包部署"等操作时触发此技能。
---

# Blog Deploy Skill

## 概述

此技能用于将个人博客项目（React 前端 + Node.js 后端）打包并部署到远程 Linux 服务器。

## 使用场景

当用户请求以下任一操作时触发：
- 部署博客到服务器
- 打包并上传前端/后端代码
- 发布项目到生产环境
- 更新线上博客

## 服务器信息

- **IP 地址**: `39.106.192.238`
- **目标目录**: `/usr/local/myblog`
  - **前端目录**: `/usr/local/myblog/fontEnd`
  - **后端目录**: `/usr/local/myblog/projectServer`
- **用户**: root（默认）

## 工作流程

### 第一步：安装依赖并打包前端代码

1. **安装前端依赖**（确保 node_modules 存在）：
   ```bash
   cd fontEnd && npm install
   ```

2. **执行 webpack 打包**：
   ```bash
   cd fontEnd && npm run build
   ```

打包完成后，确认 `fontEnd/dist` 目录已生成。

### 第二步：上传前端代码到服务器

使用 scp 或 rsync 将打包后的前端文件上传到服务器：

```bash
scp -r fontEnd/dist/* root@39.106.192.238:/usr/local/myblog/fontEnd/
```

或者使用 rsync（增量同步，更高效）：

```bash
rsync -avz --delete fontEnd/dist/ root@39.106.192.238:/usr/local/myblog/fontEnd/
```

### 第三步：询问是否需要上传后端代码

**必须等待用户确认后再执行后续步骤。**

向用户询问：

> 前端代码已上传完成。是否需要同时上传后端代码（projectServer）？

- 如果用户回答 **是/需要/好** → 执行第四步
- 如果用户回答 **否/不需要/不用** → 结束流程，告知用户部署完成

### 第五步（可选）：上传后端代码

如果用户确认需要上传后端代码，则执行：

```bash
scp -r projectServer/* root@39.106.192.238:/usr/local/myblog/projectServer/
```

或使用 rsync：

```bash
rsync -avz --delete projectServer/ root@39.106.192.238:/usr/local/myblog/projectServer/
```

### 第七步：安装依赖并启动服务

上传完成后，自动执行以下操作：

1. **修复 npm 配置**（切换到官方源）并**删除旧的 package-lock.json**
2. **安装 npm 依赖**：
   ```bash
   npm config set registry https://registry.npmjs.org/
   cd /usr/local/myblog/projectServer && npm install
   ```
3. **停止旧服务**（如果存在）：
   ```bash
   kill -9 $(lsof -ti:3000)
   ```
4. **启动后端服务**（后台运行）：
   ```bash
   cd /usr/local/myblog/projectServer && nohup node bin/www > /tmp/myblog.log 2>&1 &
   ```
5. **检查服务状态**：
   - 检查端口 `3000` 是否在监听
   - 检查 Node.js 进程是否存在
   - 显示最近的服务日志

### 第八步：重启 Nginx 服务

后端服务启动成功后，自动重启 nginx 以使新配置生效：

1. **测试 nginx 配置**：
   ```bash
   nginx -t
   ```
2. **重启/重载 nginx**：
   ```bash
   systemctl restart nginx || service nginx restart || nginx -s reload
   ```
3. **验证 nginx 状态**：
   - 检查进程是否运行
   - 确认服务正常响应

### 第九步：部署完成通知

告知用户完整的部署结果：

> ✅ 部署完成！
> 
> | 项目 | 状态 |
> |------|------|
> | 前端代码 | ✅ 已上传至 `/usr/local/myblog/fontEnd` |
> | 后端代码 | ✅ 已上传至 `/usr/local/myblog/projectServer` |
> | npm 依赖 | ✅ 已安装 |
> | 后端服务 | ✅ 运行中 (端口: 3000) |
> | Nginx    | ✅ 已重启 |
> 
> 访问地址：http://39.106.192.238
> 
> - 后端日志：`tail -f /tmp/myblog.log`
> - Nginx 日志：`tail -f /var/log/nginx/access.log`

## 注意事项

1. **SSH 连接**: 确保本地已配置 SSH 密钥认证或能通过密码登录服务器
2. **目录权限**: 确保 `/usr/local/myblog` 目录有正确的写权限
3. **Node.js 依赖**: 上传后端代码后，可能需要在服务器上执行 `npm install` 安装依赖
4. **服务重启**: 后端代码更新后，通常需要重启 Node.js 服务（如 pm2 restart）

## 可用的脚本

技能提供了自动化部署脚本 `scripts/deploy.sh`，可以一键执行完整的部署流程。

### 使用方式

```bash
# 仅部署前端
bash .codebuddy/skills/blog-deploy/scripts/deploy.sh frontend

# 部署前端 + 后端
bash .codebuddy/skills/blog-deploy/scripts/deploy.sh full

# 自定义参数
bash .codebuddy/skills/blog-deploy/scripts/deploy.sh frontend --server 39.106.192.238 --path /usr/local/myblog
```

### 脚本参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `$1` | 部署模式：`frontend`(仅前端) 或 `full`(全量) | `frontend` |
| `--server` | 目标服务器 IP | `39.106.192.238` |
| `--path` | 服务器目标目录 | `/usr/local/myblog` |
| `--no-build` | 跳过构建步骤，仅上传 | false |
| `-y` | 自动确认上传后端（跳过询问） | false |
