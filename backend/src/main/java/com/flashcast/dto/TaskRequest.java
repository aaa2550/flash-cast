package com.flashcast.dto;

import com.flashcast.enums.TaskType;
import lombok.Data;

@Data
public class TaskRequest {
    private TaskType type;
    private String json;
}
