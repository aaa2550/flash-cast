package com.flashcast.dto;

import lombok.Data;

/**
 * 创建任务请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class TaskCreateRequest {
    /**
     * 起始步骤
     */
    private Integer startStep;
    
    /**
     * JSON数据
     */
    private String json;
}
