-- Flash Cast 数据库初始化脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `fc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `fc`;

-- 用户表
DROP TABLE IF EXISTS `fc_user`;
CREATE TABLE `fc_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(11) NOT NULL COMMENT '手机号（唯一）',
  `nickname` varchar(50) DEFAULT NULL COMMENT '用户昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint(1) DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  `birthday` varchar(10) DEFAULT NULL COMMENT '生日（格式：yyyy-MM-dd）',
  `bio` varchar(500) DEFAULT NULL COMMENT '个人简介',
  `status` tinyint(1) DEFAULT 0 COMMENT '账号状态：0-正常，1-禁用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';


-- 资源表
DROP TABLE IF EXISTS `fc_resource`;
CREATE TABLE `fc_resource` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '资源ID',
  `type` varchar(20) NOT NULL COMMENT '资源类型：VIDEO-视频，AUDIO-音频，IMAGE-图片',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `name` varchar(255) NOT NULL COMMENT '资源名称',
  `path` varchar(500) NOT NULL COMMENT '资源存储路径',
  `suffix` varchar(10) DEFAULT NULL COMMENT '文件后缀名',
  `size` bigint(20) DEFAULT 0 COMMENT '文件大小（字节）',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源文件表';

-- 任务表
DROP TABLE IF EXISTS `fc_task`;
CREATE TABLE `fc_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `type` varchar(50) NOT NULL COMMENT '任务类型：LIP_SYNC_TASK-唇形同步任务',
  `json` text COMMENT '任务配置JSON数据',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `status` varchar(20) DEFAULT 'PENDING' COMMENT '任务状态：PENDING-待处理，RUNNING-执行中，SUCCESS-成功，FAILED-失败，CANCELED-已取消',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务信息表';

-- 样式表
DROP TABLE IF EXISTS `fc_style`;
CREATE TABLE `fc_style` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '样式ID',
  `content` text NOT NULL COMMENT '样式内容（JSON格式或其他格式）',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='样式配置表';


-- ===========================================
-- 模板表 (fc_template) - 基于 TemplateDO 实体类
-- ===========================================
DROP TABLE IF EXISTS `fc_template`;
CREATE TABLE IF NOT EXISTS fc_template (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '模板ID',
    name VARCHAR(100) NOT NULL COMMENT '模板名称',
    description TEXT COMMENT '模板描述',
    type VARCHAR(20) NOT NULL COMMENT '模板类型(VIDEO-视频模板,AUDIO-音频模板)',
    relation_id BIGINT COMMENT '关联ID(关联到具体的资源或风格)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除(0-正常,1-删除)',

    -- 索引
    INDEX idx_type (type),
    INDEX idx_relation_id (relation_id),
    INDEX idx_create_time (create_time),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板表';

-- ===========================================
-- 插入测试数据
-- ===========================================
INSERT INTO fc_template (name, description, type, relation_id) VALUES
('商业产品介绍视频模版', '专业的商业产品介绍视频模板，适合企业宣传和产品展示', 'VIDEO', NULL),
('教育课程讲解视频模版', '适合在线教育和培训课程的专业视频模板', 'VIDEO', NULL),
('新闻资讯播报视频模版', '专业的新闻播报视频模板，适合资讯类内容制作', 'VIDEO', NULL),
('生活方式分享视频模版', '轻松愉快的生活方式分享视频模板，适合个人博主和生活内容', 'VIDEO', NULL),
('科技产品评测视频模版', '专业的科技产品评测视频模板，适合数码产品介绍和测评', 'VIDEO', NULL),
('健康养生指导视频模版', '专业的健康养生指导视频模板，适合健康科普和养生内容', 'VIDEO', NULL),
('商务演讲音频模版', '专业的商务演讲音频模板，适合企业培训和会议', 'AUDIO', NULL),
('教学讲解音频模版', '清晰的教学讲解音频模板，适合在线课程和知识分享', 'AUDIO', NULL);


-- 插入测试数据
INSERT INTO `fc_user` (`phone`, `nickname`, `gender`, `status`) VALUES
('13800138000', '测试用户1', 1, 0),
('13800138001', '测试用户2', 2, 0);

-- 插入资源测试数据
INSERT INTO `fc_resource` (`type`, `user_id`, `name`, `path`, `suffix`, `size`) VALUES
('VIDEO', 1, '测试视频1.mp4', '/uploads/videos/test1.mp4', 'mp4', 52428800),
('AUDIO', 1, '测试音频1.mp3', '/uploads/audios/test1.mp3', 'mp3', 3145728),
('IMAGE', 2, '测试图片1.jpg', '/uploads/images/test1.jpg', 'jpg', 1048576),
('VIDEO', 2, '测试视频2.mov', '/uploads/videos/test2.mov', 'mov', 73400320);

-- 插入任务测试数据
INSERT INTO `fc_task` (`type`, `json`, `user_id`, `status`) VALUES
('LIP_SYNC_TASK', '{"videoId": 1, "audioId": 2, "outputFormat": "mp4"}', 1, 'PENDING'),
('LIP_SYNC_TASK', '{"videoId": 4, "audioId": 2, "outputFormat": "mov"}', 2, 'RUNNING'),
('LIP_SYNC_TASK', '{"videoId": 1, "audioId": 2, "outputFormat": "mp4"}', 1, 'SUCCESS');

-- 插入样式测试数据
INSERT INTO `fc_style` (`content`, `user_id`) VALUES
('{"theme": "dark", "fontSize": 14, "fontFamily": "Arial"}', 1),
('{"theme": "light", "fontSize": 16, "fontFamily": "Helvetica"}', 2),
('{"theme": "auto", "fontSize": 12, "fontFamily": "Times"}', 1);