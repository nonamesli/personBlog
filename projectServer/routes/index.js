let express = require('express');
var router = express.Router();
let connection = require('../mysql/connect');
let { authMiddleware, JWT_SECRET } = require('../middleware/auth');
let jwt = require('jsonwebtoken');
let axios = require('axios');
let { searchTableSql, searchTableTotalSql, searchArticleListByType, searchArticleDetailById, addArticle, getRouterConfig, getLatestArticles, updateArticle, deleteArticle, getPrevArticle, getNextArticle, countArticleByType, getResume, initResume, updateResumeContent, updateResumeSchema } = require('../mysql/sql');
let { resumeSchema: defaultResumeSchema, defaultResumeData } = require('../config/resumeDefault');

// 从请求头中解析当前登录用户信息（可选，不登录返回 null）
function getCurrentUser (req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function getCurrentUserId (req) {
  const user = getCurrentUser(req);
  return user ? user.userId : null;
}

function isAdmin (req) {
  const user = getCurrentUser(req);
  return user && user.role === 'admin';
}

//路由
router.get('/api/getRouterConfig', function (req, res, next) {
  connection.query(getRouterConfig, function (error, results) {
    let obj = {
      data: results,
      meta: {
        code: 0
      }
    }
    res.send(obj);
  });
})

//最新文章
router.get('/api/getLatestArticles', function (req, res, next) {
  let limit = Number(req.query.limit) || 5;
  const currentUser = getCurrentUser(req);
  const userId = currentUser ? currentUser.userId : null;
  const adminFlag = isAdmin(req);
  const latestSql = getLatestArticles(userId, adminFlag);
  const params = userId && !adminFlag ? [userId, limit] : [limit];
  connection.query(latestSql, params, function (err, results) {
    let obj = {
      data: results,
      meta: {
        code: 0
      }
    }
    res.send(obj);
  });
})


//首页

/**
 * 获取表格接口
 */
router.get('/api/users', function (req, res, next) {
  // console.log(req);
  let { name, pageNum, pageSize } = req.query;

  let current = Number(pageNum) - 1;
  let size = Number(pageSize);
  connection.query(searchTableSql, [current * size, size], function (error, results) {
    if (error) {
      throw error;
    };
    connection.query(searchTableTotalSql, function (err, totalList) {
      let obj = {
        data: {
          total: totalList[0]['count(*)'],
          pageSize: Number(pageSize),
          pageNum: Number(pageNum),
          list: results
        },
        meta: {
          code: 0
        }
      }
      res.send(obj);
    });
  });
});

/**
 * 获取文章列表接口（支持分页）
 */
router.get('/api/getArticleList', function (req, res, next) {
  let { type, pageNum = '1', pageSize = '10' } = req.query;
  const page = Number(pageNum);
  const size = Number(pageSize);
  const offset = (page - 1) * size;
  const currentUser = getCurrentUser(req);
  const userId = currentUser ? currentUser.userId : null;
  const adminFlag = isAdmin(req);

  const listSql = searchArticleListByType(userId, adminFlag);
  const countSql = countArticleByType(userId, adminFlag);
  const listParams = userId && !adminFlag ? [type, userId, offset, size] : [type, offset, size];
  const countParams = userId && !adminFlag ? [type, userId] : [type];

  connection.query(listSql, listParams, function (err, results) {
    if (err) {
      res.send({ data: [], meta: { code: 1, msg: err.message } });
      return;
    }
    // 查询总数
    connection.query(countSql, countParams, function (err2, countRes) {
      const total = countRes[0]?.total || 0;
      res.send({
        data: results,
        total,
        meta: { code: 0 }
      });
    });
  });
})


//文章
/**
 * 根据id获取文章详情
 */
router.get('/api/getArticleDetailById', function (req, res, next) {
  let { id } = req.query;
  connection.query(searchArticleDetailById, [id], function (err, results) {
    if (err || !results.length) {
      res.send({ data: [], meta: { code: 1 } });
      return;
    }
    const article = results[0];

    // 非公开文章只有作者或管理员能查看
    const viewer = getCurrentUser(req);
    const viewerId = viewer ? viewer.userId : null;
    const viewerIsAdmin = isAdmin(req);
    if (article.is_public === 0) {
      const isOwner = viewerId === article.user_id;
      if (!isOwner && !viewerIsAdmin) {
        return res.status(403).send({ data: [], meta: { code: 403, msg: '该文章为非公开状态' } });
      }
    }

    const articleType = article.type;
    const prevSql = getPrevArticle(viewerId, viewerIsAdmin);
    const nextSql = getNextArticle(viewerId, viewerIsAdmin);
    const prevParams = viewerId && !viewerIsAdmin ? [articleType, id, viewerId] : [articleType, id];
    const nextParams = viewerId && !viewerIsAdmin ? [articleType, id, viewerId] : [articleType, id];

    // 查询上一篇和下一篇（同类型，且当前用户有权限查看）
    connection.query(prevSql, prevParams, function (err1, prev) {
      connection.query(nextSql, nextParams, function (err2, next) {
        article.prevArticle = prev[0] || null;
        article.nextArticle = next[0] || null;
        res.send({
          data: [article],
          meta: { code: 0 }
        });
      });
    });
  })
})


//新增文章（需要登录）
router.post('/api/addArticle', authMiddleware, function (req, res, next) {
  let { title, type, desc: description, content, is_public = 1 } = req.body;
  const userId = req.user.userId;
  // 统一用 submiter 字段保存作者昵称
  const submiter = req.user.nickname || req.user.username;
  const now = new Date();
  const submitTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const publicFlag = is_public === 0 || is_public === false || is_public === '0' ? 0 : 1;
  // 新增文章时，修改人和修改时间为空
  connection.query(addArticle, [title, type, description, content, submiter, submitTime, null, null, userId, publicFlag], function (err, results) {
    if (err) {
      res.send({ data: null, meta: { code: 1, msg: err.message } });
      return;
    }
    res.send({
      data: { id: results.insertId },
      meta: { code: 0 }
    });
  })
});

//更新文章（需要登录，普通用户只能修改自己的文章，管理员可以修改所有文章但不改变原作者）
router.post('/api/updateArticle', authMiddleware, function (req, res, next) {
  let { id, title, type, desc: description, content, is_public = 1 } = req.body;
  const isAdminUser = req.user.role === 'admin';

  connection.query(searchArticleDetailById, [id], function (err, results) {
    if (err || !results.length) {
      return res.send({ data: null, meta: { code: 1, msg: '文章不存在' } });
    }
    const article = results[0];
    if (!isAdminUser && article.user_id !== req.user.userId) {
      return res.status(403).send({ data: null, meta: { code: 403, msg: '没有权限修改该文章' } });
    }

    // 保留原提交人信息不变
    const publicFlag = is_public === 0 || is_public === false || is_public === '0' ? 0 : 1;
    // 记录当前修改人和修改时间
    const modifier = req.user.nickname || req.user.username;
    const now = new Date();
    const updateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    connection.query(updateArticle, [title, type, description, content, publicFlag, modifier, updateTime, id], function (err2, updateRes) {
      if (err2) {
        return res.send({ data: null, meta: { code: 1, msg: err2.message } });
      }
      res.send({
        data: { affectedRows: updateRes.affectedRows },
        meta: { code: 0, msg: '更新成功' }
      });
    });
  });
});

//删除文章（需要登录，普通用户只能删除自己的文章，管理员可以删除所有文章）
router.post('/api/deleteArticle', authMiddleware, function (req, res, next) {
  let { id } = req.body;
  const isAdminUser = req.user.role === 'admin';

  connection.query(searchArticleDetailById, [id], function (err, results) {
    if (err || !results.length) {
      return res.send({ data: null, meta: { code: 1, msg: '文章不存在' } });
    }
    const article = results[0];
    if (!isAdminUser && article.user_id !== req.user.userId) {
      return res.status(403).send({ data: null, meta: { code: 403, msg: '没有权限删除该文章' } });
    }

    connection.query(deleteArticle, [id], function (err2, delRes) {
      if (err2) {
        return res.send({ data: null, meta: { code: 1, msg: err2.message } });
      }
      res.send({
        data: { affectedRows: delRes.affectedRows },
        meta: { code: 0, msg: '删除成功' }
      });
    });
  });
});
//联系

// 安全解析 JSON 字段（兼容 MySQL 已解析对象或字符串）
function safeJsonParse (value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

// 获取简历（公开接口，无需登录）：返回 schema + data，首次访问自动写入默认数据
router.get('/api/getResume', function (req, res, next) {
  connection.query(getResume, function (err, results) {
    if (err) {
      return res.status(500).send({ data: null, meta: { code: 500, msg: '查询简历失败' } });
    }

    // 没有记录时自动初始化默认 schema 和 content
    if (!results || results.length === 0) {
      const schemaStr = JSON.stringify(defaultResumeSchema);
      const contentStr = JSON.stringify(defaultResumeData);
      return connection.query(initResume, [schemaStr, contentStr], function (initErr) {
        if (initErr) {
          return res.status(500).send({ data: null, meta: { code: 500, msg: '初始化简历失败' } });
        }
        res.send({
          data: { schema: defaultResumeSchema, data: defaultResumeData },
          meta: { code: 0 }
        });
      });
    }

    const row = results[0];
    // 兼容旧表结构（只有 data 字段）：自动迁移到新结构
    if (row.data !== undefined && (row.schema_json === undefined || row.content_json === undefined)) {
      const migratedSchema = defaultResumeSchema;
      const migratedContent = safeJsonParse(row.data, defaultResumeData);
      const schemaStr = JSON.stringify(migratedSchema);
      const contentStr = JSON.stringify(migratedContent);
      return connection.query('replace into resume(id, schema_json, content_json, version) values(1, ?, ?, 1)', [schemaStr, contentStr], function (migrateErr) {
        if (migrateErr) {
          return res.status(500).send({ data: null, meta: { code: 500, msg: '迁移简历数据失败' } });
        }
        res.send({
          data: { schema: migratedSchema, data: migratedContent },
          meta: { code: 0 }
        });
      });
    }

    const schema = safeJsonParse(row.schema_json, defaultResumeSchema);
    const data = safeJsonParse(row.content_json, defaultResumeData);
    res.send({ data: { schema, data }, meta: { code: 0 } });
  });
});

// 更新简历内容（仅管理员）
router.post('/api/updateResume', authMiddleware, function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ data: null, meta: { code: 403, msg: '仅管理员可修改简历' } });
  }
  const { data } = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).send({ data: null, meta: { code: 400, msg: '简历数据不能为空' } });
  }
  const contentStr = JSON.stringify(data);
  connection.query(updateResumeContent, [contentStr], function (err, results) {
    if (err) {
      return res.status(500).send({ data: null, meta: { code: 500, msg: '更新简历失败' } });
    }
    if (results.affectedRows === 0) {
      // 没有记录则使用默认 schema 初始化后再更新 content
      const schemaStr = JSON.stringify(defaultResumeSchema);
      return connection.query(initResume, [schemaStr, contentStr], function (err2) {
        if (err2) {
          return res.status(500).send({ data: null, meta: { code: 500, msg: '新增简历失败' } });
        }
        res.send({ data: null, meta: { code: 0, msg: '保存成功' } });
      });
    }
    res.send({ data: null, meta: { code: 0, msg: '保存成功' } });
  });
});

// 更新简历 JSON Schema（仅管理员）
router.post('/api/updateResumeSchema', authMiddleware, function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ data: null, meta: { code: 403, msg: '仅管理员可修改简历 Schema' } });
  }
  const { schema } = req.body;
  if (!schema || typeof schema !== 'object') {
    return res.status(400).send({ data: null, meta: { code: 400, msg: 'Schema 不能为空' } });
  }
  const schemaStr = JSON.stringify(schema);
  connection.query(updateResumeSchema, [schemaStr], function (err, results) {
    if (err) {
      return res.status(500).send({ data: null, meta: { code: 500, msg: '更新 Schema 失败' } });
    }
    if (results.affectedRows === 0) {
      const contentStr = JSON.stringify(defaultResumeData);
      return connection.query(initResume, [schemaStr, contentStr], function (err2) {
        if (err2) {
          return res.status(500).send({ data: null, meta: { code: 500, msg: '初始化简历 Schema 失败' } });
        }
        res.send({ data: null, meta: { code: 0, msg: 'Schema 保存成功' } });
      });
    }
    res.send({ data: null, meta: { code: 0, msg: 'Schema 保存成功' } });
  });
});

// AI 对话（后端代理，保护 API Key）
router.post('/api/ai/chat', async function (req, res, next) {
  const { message, history = [] } = req.body;
  if (!message) {
    return res.status(400).send({ data: null, meta: { code: 400, msg: '消息不能为空' } });
  }

  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1';
  const model = process.env.AI_MODEL || 'deepseek-chat';

  if (!apiKey) {
    return res.status(500).send({ data: null, meta: { code: 500, msg: '未配置 AI API Key' } });
  }

  try {
    const messages = [
      { role: 'system', content: '你是一个有帮助的博客 AI 助手，可以回答技术问题、总结文章、提供建议。回答要简洁清晰。' },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      `${baseURL}/chat/completions`,
      { model, messages },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'AI 没有返回内容';
    res.send({ data: reply, meta: { code: 0 } });
  } catch (err) {
    const detail = err.response?.data;
    console.error('AI 调用失败:', detail || err.message);
    const msg = detail?.error?.message || detail?.message || 'AI 服务调用失败';
    res.status(500).send({ data: null, meta: { code: 500, msg } });
  }
});

module.exports = router;
