package com.flashcast.dto;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class RunningHubStatusBody {
    private String apiKey;
    private String taskId;
}
