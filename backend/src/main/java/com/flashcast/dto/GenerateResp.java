package com.flashcast.dto;

import com.flashcast.enums.TaskStatus;
import lombok.Data;

@Data
public class GenerateResp {
    private TaskStatus status;
    private String result;
}
