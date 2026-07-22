-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '登录账号',
  `password` VARCHAR(255) NOT NULL COMMENT '加密后的密码',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称/作者名',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户角色字段
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin 管理员，user 普通用户';

-- 更新默认管理员角色
UPDATE `users` SET `role` = 'admin' WHERE `username` = 'admin';

-- 文章表新增字段（如果已存在会报错，可忽略）
ALTER TABLE `article` ADD COLUMN `user_id` INT DEFAULT NULL COMMENT '文章作者用户ID';
ALTER TABLE `article` ADD COLUMN `is_public` TINYINT NOT NULL DEFAULT 1 COMMENT '是否公开：1公开，0非公开';
ALTER TABLE `article` ADD COLUMN `time` VARCHAR(50) DEFAULT NULL COMMENT '文章时间';

-- 创建默认管理员用户（密码是 123456 的 bcrypt 加密结果）
-- 登录账号：admin，密码：123456
INSERT IGNORE INTO `users` (`username`, `password`, `nickname`) VALUES
('admin', '$2b$10$sXrDmsd2iTPOpcTEBmjyee37PyJ5XXoPW7Plo0Qv7VlKWR50ld8Tu', '管理员');

-- 如果旧文章没有 user_id，默认归到 admin 用户（id 为 1）
UPDATE `article` SET `user_id` = 1 WHERE `user_id` IS NULL;
