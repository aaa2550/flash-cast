package com.flashcast.strategy.task;

import com.flashcast.dto.Task;
import com.flashcast.enums.TaskType;

public interface TaskExecutor {
    TaskType getType();
    void execute(Task task);
}
