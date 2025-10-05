package com.flashcast.dto;

import lombok.Data;

/**
 * 发布视频请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class PublishRequest {
    /**
     * 子任务ID
     */
    private Long subTaskId;
    
    /**
     * 待上传视频路径
     */
    private String videoPath;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 描述
     */
    private String description;
}
