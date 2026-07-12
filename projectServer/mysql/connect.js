const mysql = require('mysql2');
//链接 myproject 数据库，使用连接池（mysql2 支持 MySQL 8.0 的 caching_sha2_password）
const pool = mysql.createPool({
    host: '39.106.192.238',
    port: 3306,
    user: 'root',
    password: 'lzd@720930',
    database: 'myproject',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    allowPublicKeyRetrieval: true
});

module.exports = pool;
