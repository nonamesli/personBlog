let express = require('express');
var router = express.Router();
let connection = require('../mysql/connect');
let { authMiddleware, JWT_SECRET } = require('../middleware/auth');
let jwt = require('jsonwebtoken');
let { searchTableSql, searchTableTotalSql, searchArticleListByType, searchArticleDetailById, addArticle, getRouterConfig, getLatestArticles, updateArticle, deleteArticle, getPrevArticle, getNextArticle, countArticleByType } = require('../mysql/sql');

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
  connection.query(getLatestArticles, [limit], function (err, results) {
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
  let { title, type, desc: description, time, content, is_public = 1 } = req.body;
  const userId = req.user.userId;
  const author = req.user.nickname || req.user.username;
  let submitTime = new Date().toLocaleDateString().replace(/\//g, '-');
  const publicFlag = is_public === 0 || is_public === false || is_public === '0' ? 0 : 1;
  connection.query(addArticle, [title, author, type, description, time, content, req.user.username, submitTime, userId, publicFlag], function (err, results) {
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
  let { id, title, type, desc: description, time, content, is_public = 1 } = req.body;
  const isAdminUser = req.user.role === 'admin';

  connection.query(searchArticleDetailById, [id], function (err, results) {
    if (err || !results.length) {
      return res.send({ data: null, meta: { code: 1, msg: '文章不存在' } });
    }
    const article = results[0];
    if (!isAdminUser && article.user_id !== req.user.userId) {
      return res.status(403).send({ data: null, meta: { code: 403, msg: '没有权限修改该文章' } });
    }

    // 保留原作者信息
    const author = article.author;
    const submiter = article.submiter;
    const userId = article.user_id;

    const publicFlag = is_public === 0 || is_public === false || is_public === '0' ? 0 : 1;
    connection.query(updateArticle, [title, author, type, description, time, content, publicFlag, id], function (err2, updateRes) {
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











module.exports = router;
