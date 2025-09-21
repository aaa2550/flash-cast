package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TaskType {
    NONE(null),
    LIP_SYNC_BASIC("视频+语音合成口播"),
    LIP_SYNC_WITH_VOICE("视频+音色+文案合成口播"),
    LIP_SYNC_FULL("视频+音色+文案+风格合成口播");;

    private String name;

}
