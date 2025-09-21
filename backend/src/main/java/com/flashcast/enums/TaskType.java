package com.flashcast.enums;

import com.flashcast.dto.LipSyncVideoVoiceModel;
import com.flashcast.dto.LipSyncVideoVoiceStyleModel;
import com.flashcast.dto.LipSyncVideoVoiceToneModel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;

@Getter
@AllArgsConstructor
public enum TaskType {
    NONE(null, null, Set.of()),
    LIP_SYNC_VIDEO_VOICE("视频+语音合成口播", LipSyncVideoVoiceModel.class, Set.of(SubTaskType.LIP_SYNC_VIDEO_VOICE)),
    LIP_SYNC_VIDEO_VOICE_TONE("视频+音色+文案合成口播", LipSyncVideoVoiceToneModel.class, Set.of()),
    LIP_SYNC_VIDEO_VOICE_STYLE("视频+音色+文案+风格合成口播", LipSyncVideoVoiceStyleModel.class, Set.of());

    private String name;
    private Class<?> clazz;
    private Set<SubTaskType> subTaskTypes;

}
