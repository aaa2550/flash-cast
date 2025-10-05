package com.flashcast.dto;

import lombok.Data;

/**
 * 解析视频文案请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class LinkParseRequest {
    /**
     * 子任务ID
     */
    private Long subTaskId;
    
    /**
     * 抖音链接
     */
    private String link;
}
