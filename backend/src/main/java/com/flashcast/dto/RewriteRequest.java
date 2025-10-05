package com.flashcast.dto;

import lombok.Data;

/**
 * 重写文案请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class RewriteRequest {
    /**
     * 子任务ID
     */
    private Long subTaskId;
    
    /**
     * 原内容
     */
    private String content;
    
    /**
     * 风格
     */
    private String styles;
    
    /**
     * 语气倾向
     */
    private String tone;
    
    /**
     * 附加要求
     */
    private String extraInstructions;
}
