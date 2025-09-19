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

-- 媒体文件表（为将来的媒体功能预留）
DROP TABLE IF EXISTS `fc_media`;
CREATE TABLE `fc_media` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '媒体文件ID',
  `user_id` bigint(20) NOT NULL COMMENT '上传用户ID',
  `file_name` varchar(255) NOT NULL COMMENT '文件名',
  `file_path` varchar(500) NOT NULL COMMENT '文件路径',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小（字节）',
  `file_type` varchar(50) NOT NULL COMMENT '文件类型（video/audio/image）',
  `mime_type` varchar(100) NOT NULL COMMENT 'MIME类型',
  `duration` int(11) DEFAULT NULL COMMENT '时长（秒，仅音视频）',
  `width` int(11) DEFAULT NULL COMMENT '宽度（像素，仅图片/视频）',
  `height` int(11) DEFAULT NULL COMMENT '高度（像素，仅图片/视频）',
  `thumbnail_path` varchar(500) DEFAULT NULL COMMENT '缩略图路径',
  `status` tinyint(1) DEFAULT 0 COMMENT '状态：0-正常，1-处理中，2-失败',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`),
  CONSTRAINT `fk_media_user` FOREIGN KEY (`user_id`) REFERENCES `fc_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='媒体文件表';

-- 视频生成任务表（为将来的AI视频生成功能预留）
DROP TABLE IF EXISTS `fc_video_task`;
CREATE TABLE `fc_video_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `task_id` varchar(100) NOT NULL COMMENT '外部任务ID',
  `prompt` text NOT NULL COMMENT '生成提示词',
  `parameters` json DEFAULT NULL COMMENT '生成参数（JSON格式）',
  `status` tinyint(1) DEFAULT 0 COMMENT '任务状态：0-待处理，1-处理中，2-已完成，3-失败',
  `progress` int(3) DEFAULT 0 COMMENT '进度百分比（0-100）',
  `result_url` varchar(500) DEFAULT NULL COMMENT '生成结果URL',
  `error_message` text DEFAULT NULL COMMENT '错误信息',
  `cost` decimal(10,4) DEFAULT NULL COMMENT '消费金额',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_task_id` (`task_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted` (`deleted`),
  KEY `idx_create_time` (`create_time`),
  CONSTRAINT `fk_video_task_user` FOREIGN KEY (`user_id`) REFERENCES `fc_user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='视频生成任务表';

-- 验证码缓存表（可选，如果不使用Redis的话）
DROP TABLE IF EXISTS `fc_verify_code`;
CREATE TABLE `fc_verify_code` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `phone` varchar(11) NOT NULL COMMENT '手机号',
  `code` varchar(6) NOT NULL COMMENT '验证码',
  `type` varchar(20) NOT NULL COMMENT '验证码类型：LOGIN-登录，REGISTER-注册',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `used` tinyint(1) DEFAULT 0 COMMENT '是否已使用：0-未使用，1-已使用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone_type` (`phone`, `type`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证码缓存表';

-- 插入测试数据
INSERT INTO `fc_user` (`phone`, `nickname`, `gender`, `status`) VALUES
('13800138000', '测试用户1', 1, 0),
('13800138001', '测试用户2', 2, 0);