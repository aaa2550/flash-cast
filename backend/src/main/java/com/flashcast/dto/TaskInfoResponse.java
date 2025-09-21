package com.flashcast.dto;

import lombok.Data;

import java.util.List;

@Data
public class TaskInfoResponse {
    private List<TaskInfo> tasks;
}
