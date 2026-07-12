let express = require('express');
var router = express.Router();
let connection = require('../mysql/connect');
let { searchTableSql, searchTableTotalSql, searchArticleListByType, searchArticleDetailById, addArticle, getRouterConfig, getLatestArticles, updateArticleContent } = require('../mysql/sql');

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
 * 获取文章列表接口
 */
router.get('/api/getArticleList', function (req, res, next) {
  let { type } = req.query;
  connection.query(searchArticleListByType, [type], function (err, results) {
    let obj = {
      data: results,
      meta: {
        code: 0
      }
    }
    res.send(obj);
  })
})


//文章
/**
 * 根据id获取文章详情
 */
router.get('/api/getArticleDetailById', function (req, res, next) {
  let { id } = req.query;
  connection.query(searchArticleDetailById, [id], function (err, results) {
    let obj = {
      data: results,
      meta: {
        code: 0
      }
    }
    res.send(obj);
  })
})


//新增文章
router.post('/api/addArticle', function (req, res, next) {
  let { title, author, type, desc: description, time, content } = req.body;
  let submitTime = new Date().toLocaleDateString().replace(/\//g, '-');
  connection.query(addArticle, [title, author, type, description, time, content, 'lzd', submitTime], function (err, results) {
    console.log(results, 'results');
    let obj = {
      data: { id: results.insertId },
      meta: {
        code: 0
      }
    }
    res.send(obj);
  })
});



//更新文章内容
router.post('/api/updateArticleContent', function (req, res, next) {
  let { id, content } = req.body;
  connection.query(updateArticleContent, [content, id], function (err, results) {
    if (err) {
      res.send({ data: null, meta: { code: 1, msg: err.message } });
      return;
    }
    res.send({
      data: { affectedRows: results.affectedRows },
      meta: { code: 0 }
    });
  });
});


//联系











module.exports = router;
