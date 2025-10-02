package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SubTaskType {
    NONE(null, null),
    LIP_SYNC_VIDEO_VOICE("视频口型合成", null),
    COPY_GENERATION("文案生成", null),
    VOICE_SYNTHESIS("语音合成", null),
    LINK_PARSE("链接解析文案", "douyin"),
    COPY_REPRODUCE("文案复刻", "rewrite"),
    TIMBRE_SYNTHESIS("音色合成", null),
    VIDEO_SYNTHESIS("视频合成", null),
    ;

    private String strategy;

    private String name;
}
