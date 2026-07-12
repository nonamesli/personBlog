//sql语句

/*
    首页查询表格数据
*/
exports.searchTableSql = 'select * from city LIMIT ?,?';

/*
    查询数据条数
*/
exports.searchTableTotalSql = 'select count(*) from city';

/**
 * 通过id查询单个文章
 */

exports.searchArticleDetailById = 'select * from article where id = ?';

/**
 * 查询整个文章列表
 */

exports.searchArticleListByType = 'select * from article where type= ?';

/**
 * 新增文章
 */
exports.addArticle = "insert into article(title, author, type, description, time, content, submiter, submitTime) values(?, ?, ?, ?, ?, ?, ?, ?)";

/**
 * 更新文章内容
 */
exports.updateArticleContent = "update article set content = ? where id = ?";

/**
 * 获取路由配置
 */
exports.getRouterConfig = "select * from router";

/**
 * 最新文章（按 id 倒序取前 N 条）
 */
exports.getLatestArticles = 'select * from article order by id desc limit ?';