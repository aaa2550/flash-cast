package com.flashcast.dto;

import com.flashcast.enums.PixelType;
import lombok.Data;

@Data
public class TaskModel {
    private String emotionText;
    private PixelType pixelType;
}
