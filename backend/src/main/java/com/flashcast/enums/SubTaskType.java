package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SubTaskType {
    NONE(null),
    LIP_SYNC_VIDEO_VOICE("视频口型合成"),
    COPY_GENERATION("文案生成"),
    VOICE_SYNTHESIS("语音合成");

    private String name;
}
