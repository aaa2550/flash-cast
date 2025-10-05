package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;

@Getter
@AllArgsConstructor
public enum TaskType {
    NONE(null, Set.of()),
    LIP_SYNC_VIDEO_VOICE("视频+语音合成口播", Set.of(SubTaskType.LIP_SYNC_VIDEO_VOICE)),
    LIP_SYNC_VIDEO_VOICE_TONE("视频+音色+文案合成口播", Set.of()),
    LIP_SYNC_VIDEO_VOICE_STYLE("视频+音色+文案+风格合成口播", Set.of()),
    ONE_CLICK_CLONE("一键克隆", Set.of()),
    ONE_CLICK_CLONE2("一键克隆", Set.of());


    private String name;
    private Set<SubTaskType> subTaskTypes;

}
