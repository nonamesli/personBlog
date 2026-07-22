//sql语句

/*
    用户相关
*/
exports.addUser = "insert into users(username, password, nickname, role) values(?, ?, ?, 'user')";
exports.findUserByUsername = "select * from users where username = ?";
exports.updateUserPassword = "update users set password = ? where username = ?";

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
 * 查询上一篇文章（同类型，管理员看全部，普通用户只看公开+自己的非公开）
 */
exports.getPrevArticle = function (userId, isAdmin) {
    let visible;
    if (isAdmin) {
        visible = '';
    } else if (userId) {
        visible = 'and (is_public = 1 or user_id = ?)';
    } else {
        visible = 'and is_public = 1';
    }
    return `select id, title from article where type = ? and id > ? ${visible} order by id asc limit 1`;
};

/**
 * 查询下一篇文章（同类型，管理员看全部，普通用户只看公开+自己的非公开）
 */
exports.getNextArticle = function (userId, isAdmin) {
    let visible;
    if (isAdmin) {
        visible = '';
    } else if (userId) {
        visible = 'and (is_public = 1 or user_id = ?)';
    } else {
        visible = 'and is_public = 1';
    }
    return `select id, title from article where type = ? and id < ? ${visible} order by id desc limit 1`;
};

/**
 * 查询整个文章列表（分页：未登录只看公开，普通用户还能看自己的非公开，管理员看全部）
 */
exports.searchArticleListByType = function (userId, isAdmin) {
    let visible;
    if (isAdmin) {
        visible = '';
    } else if (userId) {
        visible = 'and (is_public = 1 or user_id = ?)';
    } else {
        visible = 'and is_public = 1';
    }
    return `select * from article where type = ? ${visible} order by id desc limit ?, ?`;
};

/**
 * 统计文章数量（分页：未登录只看公开，普通用户还能看自己的非公开，管理员看全部）
 */
exports.countArticleByType = function (userId, isAdmin) {
    let visible;
    if (isAdmin) {
        visible = '';
    } else if (userId) {
        visible = 'and (is_public = 1 or user_id = ?)';
    } else {
        visible = 'and is_public = 1';
    }
    return `select count(*) as total from article where type = ? ${visible}`;
};

/**
 * 新增文章
 */
exports.addArticle = "insert into article(title, author, type, description, time, content, submiter, submitTime, user_id, is_public) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

/**
 * 根据 id 查询文章及作者信息
 */
exports.searchArticleDetailById = 'select * from article where id = ?';

/**
 * 更新文章所有字段
 */
exports.updateArticle = "update article set title = ?, author = ?, type = ?, description = ?, time = ?, content = ?, is_public = ? where id = ?";

/**
 * 删除文章
 */
exports.deleteArticle = "delete from article where id = ?";

/**
 * 获取路由配置
 */
exports.getRouterConfig = "select * from router";

/**
 * 最新公开文章（按 id 倒序取前 N 条）
 */
exports.getLatestArticles = 'select * from article where is_public = 1 order by id desc limit ?';