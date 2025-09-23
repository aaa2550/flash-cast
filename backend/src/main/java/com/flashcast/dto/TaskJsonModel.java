package com.flashcast.dto;

import lombok.Data;

@Data
public class TaskJsonModel {
    private Long videoId;
    private Long audioId;
    private Long styleId;
    private String videoPath;
    private String audioPath;
    private String styleContent;
    private String text;
    private String link;
}
