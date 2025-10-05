package com.flashcast.dto;

import com.flashcast.enums.PixelType;
import lombok.Data;

/**
 * 合成视频请求DTO
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-10-03
 */
@Data
public class VideoSynthesisRequest {
    /**
     * 子任务ID
     */
    private Long subTaskId;
    
    /**
     * 音频资源ID
     */
    private Long audioResourceId;
    
    /**
     * 视频资源ID
     */
    private Long videoResourceId;
    
    /**
     * 生成画面比例
     */
    private PixelType pixelType;
}
