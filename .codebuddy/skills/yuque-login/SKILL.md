---
name: "yuque-login"
description: "Helps log in to Yuque (语雀) and obtain authentication credentials. Invoke when user asks to log in to Yuque, access Yuque API, or use Yuque-related features."
---

# Yuque Login / 语雀登录

## 目标
帮助用户登录语雀（https://www.yuque.com/）并获取可用于 API 调用、文档读取或自动化操作的认证凭据。

## 适用场景
- 用户说“登录语雀”“我要用语雀 API”“帮我连接语雀”
- 需要从语雀读取/写入文档
- 需要验证语雀登录状态或刷新凭证

## 语雀支持的登录/认证方式

### 1. 网页账号登录（普通用户，免费）
- 打开登录页：https://www.yuque.com/login
- 支持：手机号 + 短信验证码，或手机号 + 密码
- 登录成功后，浏览器会保持会话 Cookie

### 2. 第三方账号登录（免费）
- 支付宝、淘宝、钉钉、微信、GitHub 等 OAuth 授权
- 在登录页点击对应图标，按提示完成授权

### 3. 半自动浏览器登录（免费，推荐个人用户使用）
用 Playwright 打开语雀登录页，你在弹出的浏览器里正常扫码/输密码；脚本会自动检测登录成功并保存 Cookie 到本地文件，后续可直接复用，过期后再重新登录。

优点：
- 不用手动打开开发者工具复制 Cookie
- 验证码、扫码、二次验证都能正常处理
- Cookie 自动保存到本地，过期才需要重新登录

运行方式：
```bash
node .codebuddy/skills/yuque-login/scripts/yuque_login_browser.js
```

首次运行前需要安装 Playwright：
```bash
cd .codebuddy/skills/yuque-login
npm install
npx playwright install chromium
```

### 4. 手动复制 Cookie 登录（免费）
如果不想安装 Playwright，也可以手动复制 Cookie。

获取步骤：
1. 浏览器登录语雀
2. 按 `F12` 打开开发者工具 → 切换到 **Network（网络）** 面板
3. 刷新页面，点击任意一个 `yuque.com` 请求
4. 右侧 **Headers** → **Request Headers** 中找到 `cookie:` 整行
5. 完整复制（包含 `_yuque_session`、`yuque_ctoken` 等字段）

### 5. 个人 API Token（付费功能，需超级会员）
⚠️ 个人用户创建 API Token 需要开通语雀“超级会员”。如果只是为了登录或偶尔读取文档，建议优先使用免费的 Cookie 方式。

获取步骤（开通会员后）：
1. 先用浏览器登录语雀
2. 访问 https://www.yuque.com/settings/tokens
3. 点击“新建 Token”
4. 填写用途，勾选所需权限：
   - 只读：勾选 `读取 (Read)`
   - 需要创建/修改文档：再勾选 `写入 (Write)`
5. 复制生成的 Token，妥善保存（只显示一次）

### 6. 团队/空间 API Token
- 部分团队/空间版本可能提供 API Token 功能
- 进入对应团队/空间的管理后台，在“团队设置”或“开发者设置”中查看
- 由团队管理员创建并分配权限

## API 调用方式

- 基础地址：`https://www.yuque.com/api/v2/`
- Token 认证：请求头添加 `X-Auth-Token: <your_token>`
- Cookie 认证：请求头添加 `Cookie: <your_cookie_string>`

常用验证接口：
- 获取当前用户信息：`GET /api/v2/user`
- 获取知识库列表：`GET /api/v2/users/:login/repos`
- 获取文档内容：`GET /api/v2/repos/:namespace/docs/:slug`

## 执行流程
1. 询问用户需要登录语雀做什么
2. 如果是普通个人用户且不想付费，优先推荐 **半自动浏览器登录**（脚本自动保存 Cookie）
3. 如果用户不想安装 Playwright，改用 **手动复制 Cookie**
4. 如果用户已开通超级会员或企业版，可以使用 **API Token**
5. 用户拿到凭证后，调用对应验证脚本检查登录状态
6. 返回验证结果和后续可用操作（如读取文档、创建文档等）

## 安全提示
- **Cookie 和 Token 都等同于账号密码**，不要提交到 git，不要分享给他人
- Cookie 通常几天到几周会过期，过期后需要重新运行登录脚本
- 如果使用 Token，优先申请最小权限（只读场景只勾选 Read）
- 发现凭证泄露后，立即到语雀设置页删除并重新生成

## 示例命令

```bash
# 半自动浏览器登录（免费，推荐）
node .codebuddy/skills/yuque-login/scripts/yuque_login_browser.js

# 手动 Cookie 验证
node .codebuddy/skills/yuque-login/scripts/verify_yuque_cookie.js "<your_cookie_string>"

# Token 验证（需超级会员）
node .codebuddy/skills/yuque-login/scripts/verify_yuque_token.js <your_token>
```
