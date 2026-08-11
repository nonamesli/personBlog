// 初始化简历默认数据
// 将 config/resumeDefault.js 中的 schema 与 content 写入 resume 表

const connection = require('../mysql/connect');
const { resumeSchema, defaultResumeData } = require('../config/resumeDefault');

const schemaJson = JSON.stringify(resumeSchema);
const contentJson = JSON.stringify(defaultResumeData);

// 确保 resume 表结构符合新设计（若存在旧结构则删除重建，因要求使用默认数据覆盖）
function ensureTableSchema (callback) {
    const dropSql = 'DROP TABLE IF EXISTS \`resume\`';
    const createTableSql = `
        CREATE TABLE \`resume\` (
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`schema_json\` JSON NOT NULL COMMENT '简历 JSON Schema 定义',
            \`content_json\` JSON NOT NULL COMMENT '简历内容数据',
            \`version\` INT NOT NULL DEFAULT 1 COMMENT '版本号',
            \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历表'
    `;

    connection.query(dropSql, function (dropErr) {
        if (dropErr) return callback(dropErr);
        connection.query(createTableSql, function (err) {
            if (err) return callback(err);
            callback();
        });
    });
}

// 写入默认数据
function initDefaultData (callback) {
    connection.query(
        'insert into resume(id, schema_json, content_json, version) values(1, ?, ?, 1)',
        [schemaJson, contentJson],
        callback
    );
}

ensureTableSchema(function (err) {
    if (err) {
        console.error('表结构初始化失败:', err.message);
        connection.end();
        process.exit(1);
    }

    initDefaultData(function (initErr, results) {
        if (initErr) {
            console.error('写入默认简历数据失败:', initErr.message);
            connection.end();
            process.exit(1);
        }
        console.log('简历默认数据写入成功，影响行数:', results.affectedRows);
        connection.end();
    });
});
