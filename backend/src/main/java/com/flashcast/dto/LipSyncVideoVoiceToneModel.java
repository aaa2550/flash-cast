package com.flashcast.dto;

import lombok.Data;

@Data
public class LipSyncVideoVoiceToneModel {
    private Long videoId;
    private Long audioId;
    private String videoPath;
    private String audioPath;
    private String text;
}
