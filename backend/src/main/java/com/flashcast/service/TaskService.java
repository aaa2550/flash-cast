package com.flashcast.service;

import com.flashcast.enums.TaskType;

public interface TaskService {
    void create(TaskType type, String json);
}
