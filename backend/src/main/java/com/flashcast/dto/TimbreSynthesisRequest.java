package com.flashcast.dto;

import lombok.Data;

/**
 * 合成音频请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class TimbreSynthesisRequest {
    /**
     * 子任务ID
     */
    private Long subTaskId;
    
    /**
     * 参考音色资源ID
     */
    private Long audioResourceId;
    
    /**
     * 文本内容
     */
    private String content;
    
    /**
     * 情绪描述词
     */
    private String emotionText;
}
