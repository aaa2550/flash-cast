package com.flashcast.dto;

import lombok.Data;

@Data
public class LipSyncVideoVoiceModel {
    private Long videoId;
    private Long audioId;
    private String videoPath;
    private String audioPath;
}
