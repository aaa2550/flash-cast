package com.flashcast.dto;

import com.flashcast.enums.TaskStatus;
import lombok.Data;

@Data
public class TaskInfo {
    private Long id;
    private TaskStatus status;
    private String content;
}
