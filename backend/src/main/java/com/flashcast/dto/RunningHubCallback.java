package com.flashcast.dto;

import lombok.Data;

@Data
public class RunningHubCallback {
    private String event;
    private String taskId;
    private String eventData;
}
