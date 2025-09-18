-- Flash Cast 数据库初始化脚本
-- 数据库版本：1.0.0
-- 创建时间：2025-09-18

-- 创建数据库
CREATE DATABASE IF NOT EXISTS flash_cast DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE flash_cast;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT COMMENT '用户ID，主键',
    `phone` VARCHAR(20) NOT NULL COMMENT '手机号，用于登录和验证',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '用户头像URL',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱地址',
    `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    `birthday` DATE DEFAULT NULL COMMENT '生日',
    `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
    `status` TINYINT DEFAULT 1 COMMENT '账户状态：0-禁用，1-正常，2-冻结',
    `last_login_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
    `register_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_nickname` (`nickname`),
    KEY `idx_status` (`status`),
    KEY `idx_register_time` (`register_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建用户关注表
CREATE TABLE IF NOT EXISTS `user_follow` (
    `id` BIGINT AUTO_INCREMENT COMMENT '关注记录ID',
    `follower_id` BIGINT NOT NULL COMMENT '关注者用户ID',
    `following_id` BIGINT NOT NULL COMMENT '被关注者用户ID',
    `follow_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_follower_following` (`follower_id`, `following_id`),
    KEY `idx_follower_id` (`follower_id`),
    KEY `idx_following_id` (`following_id`),
    KEY `idx_follow_time` (`follow_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';

-- 创建视频表
CREATE TABLE IF NOT EXISTS `video` (
    `id` BIGINT AUTO_INCREMENT COMMENT '视频ID',
    `user_id` BIGINT NOT NULL COMMENT '发布者用户ID',
    `title` VARCHAR(200) NOT NULL COMMENT '视频标题',
    `description` TEXT COMMENT '视频描述',
    `video_url` VARCHAR(500) NOT NULL COMMENT '视频文件URL',
    `cover_url` VARCHAR(500) DEFAULT NULL COMMENT '视频封面URL',
    `duration` INT DEFAULT 0 COMMENT '视频时长（秒）',
    `width` INT DEFAULT 0 COMMENT '视频宽度',
    `height` INT DEFAULT 0 COMMENT '视频高度',
    `file_size` BIGINT DEFAULT 0 COMMENT '文件大小（字节）',
    `view_count` BIGINT DEFAULT 0 COMMENT '播放次数',
    `like_count` BIGINT DEFAULT 0 COMMENT '点赞次数',
    `comment_count` BIGINT DEFAULT 0 COMMENT '评论次数',
    `share_count` BIGINT DEFAULT 0 COMMENT '分享次数',
    `status` TINYINT DEFAULT 1 COMMENT '视频状态：0-草稿，1-已发布，2-审核中，3-审核失败，4-已删除',
    `is_private` TINYINT DEFAULT 0 COMMENT '是否私密：0-公开，1-私密',
    `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `publish_time` TIMESTAMP NULL DEFAULT NULL COMMENT '发布时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_publish_time` (`publish_time`),
    KEY `idx_view_count` (`view_count`),
    KEY `idx_like_count` (`like_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频表';

-- 创建视频点赞表
CREATE TABLE IF NOT EXISTS `video_like` (
    `id` BIGINT AUTO_INCREMENT COMMENT '点赞记录ID',
    `user_id` BIGINT NOT NULL COMMENT '点赞用户ID',
    `video_id` BIGINT NOT NULL COMMENT '被点赞视频ID',
    `like_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_video` (`user_id`, `video_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_video_id` (`video_id`),
    KEY `idx_like_time` (`like_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频点赞表';

-- 创建视频评论表
CREATE TABLE IF NOT EXISTS `video_comment` (
    `id` BIGINT AUTO_INCREMENT COMMENT '评论ID',
    `video_id` BIGINT NOT NULL COMMENT '视频ID',
    `user_id` BIGINT NOT NULL COMMENT '评论用户ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父评论ID，0表示根评论',
    `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复的用户ID',
    `content` TEXT NOT NULL COMMENT '评论内容',
    `like_count` INT DEFAULT 0 COMMENT '点赞次数',
    `reply_count` INT DEFAULT 0 COMMENT '回复次数',
    `status` TINYINT DEFAULT 1 COMMENT '评论状态：0-已删除，1-正常，2-审核中，3-审核失败',
    `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0-否，1-是',
    PRIMARY KEY (`id`),
    KEY `idx_video_id` (`video_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频评论表';

-- 创建系统配置表
CREATE TABLE IF NOT EXISTS `system_config` (
    `id` BIGINT AUTO_INCREMENT COMMENT '配置ID',
    `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
    `config_value` TEXT COMMENT '配置值',
    `config_desc` VARCHAR(200) DEFAULT NULL COMMENT '配置描述',
    `config_type` VARCHAR(50) DEFAULT 'string' COMMENT '配置类型：string、number、boolean、json',
    `is_system` TINYINT DEFAULT 0 COMMENT '是否系统配置：0-否，1-是',
    `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 插入默认系统配置
INSERT INTO `system_config` (`config_key`, `config_value`, `config_desc`, `config_type`, `is_system`) VALUES
('app.name', 'Flash Cast', '应用名称', 'string', 1),
('app.version', '1.0.0', '应用版本', 'string', 1),
('user.max_nickname_length', '50', '用户昵称最大长度', 'number', 1),
('video.max_duration', '300', '视频最大时长（秒）', 'number', 1),
('video.max_file_size', '104857600', '视频文件最大大小（字节）', 'number', 1),
('comment.max_length', '500', '评论最大长度', 'number', 1),
('sms.verify_code_ttl', '300', '短信验证码有效期（秒）', 'number', 1),
('jwt.token_ttl', '604800', 'JWT令牌有效期（秒）', 'number', 1);

-- 创建管理员用户（可选）
INSERT INTO `user` (`phone`, `nickname`, `status`, `register_time`) VALUES
('18888888888', '系统管理员', 1, NOW());