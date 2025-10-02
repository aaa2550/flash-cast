package com.flashcast.dto;

import com.flashcast.enums.RunningHubStatus;
import lombok.Data;

@Data
public class RunningHubResponse {
    private String fileUrl;
    private String fileName;
    private String fileType;
    private String taskCostTime;
    private String netWssUrl;
    private String taskId;
    private RunningHubStatus taskStatus;
    private String promptTips;
}
