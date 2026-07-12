# 青春的脚步的博客 🌸

一个基于 **React + Node.js** 的个人博客系统，包含技术文章、生活记录等栏目。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 16 + Ant Design 4 + SCSS + Webpack |
| 后端 | Node.js + Express.js |
| 数据库 | MySQL |
| 路由 | react-router-dom |

## 项目结构

```
project/
├── fontEnd/              # 前端项目
│   ├── src/
│   │   ├── api/          # API 请求封装
│   │   ├── components/   # 公共组件（面包屑、文章列表、错误边界等）
│   │   ├── pages/        # 页面（首页、技术、生活、留言、写文章等）
│   │   ├── utils/        # 工具函数
│   │   └── app.js        # 路由入口
│   ├── public/           # HTML 模板
│   └── webpack.config.js # Webpack 配置
│
├── projectServer/        # 后端服务
│   ├── routes/           # API 路由
│   ├── mysql/            # 数据库连接与 SQL
│   ├── permission/       # 权限校验
│   └── app.js            # 服务入口
│
├── test_data.sql         # 测试数据 SQL
└── README.md
```

## 功能特性

- ✅ **首页** - Hero 欢迎区 + 栏目导航 + 最新文章展示
- ✅ **技术文章** / **生活记录** - 分类文章列表页
- ✅ **写文章** - 支持类型选择（技术/生活）、HTML 正文编辑
- ✅ **文章详情** - 面包屑导航、内容渲染
- ✅ **留言板** / **个人简介**
- ✅ **错误边界** - 组件异常隔离，防止白屏崩溃

## 快速开始

### 环境要求

- Node.js >= 12
- MySQL >= 5.7
- npm 或 yarn

### 1. 安装依赖

```bash
# 安装前端依赖
cd fontEnd && npm install

# 安装后端依赖
cd ../projectServer && npm install
```

### 2. 配置数据库

1. 创建 MySQL 数据库
2. 导入 `test_data.sql` 初始化表结构和测试数据
3. 修改 `projectServer/mysql/connect.js` 中的数据库连接配置

### 3. 启动项目

```bash
# 启动后端服务（默认端口 3000）
cd projectServer && node bin/www

# 启动前端开发服务器（默认端口 8080）
cd fontEnd && npm run dev
```

### 4. 访问

打开浏览器访问 http://localhost:8080

## 主要接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/getArticleList` | GET | 获取文章列表（参数: type） |
| `/api/getLatestArticles` | GET | 获取最新文章 |
| `/api/getArticleDetailById` | GET | 获取文章详情（参数: id） |
| `/api/addArticle` | POST | 发布新文章 |

## 开发说明

### 前端页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/tech` | 技术文章列表 |
| `/live` | 生活记录列表 |
| `/guestbook` | 留言板 |
| `/concat` | 个人简介 |
| `/write` | 写文章 |
| `/:pageType/article/:id` | 文章详情 |

## License

MIT
