package com.flashcast.strategy.task.subtask;

import com.flashcast.dto.SubTask;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;

import java.util.Set;

public interface SubTaskExecutor {

    Set<TaskStatus> statuses = Set.of(TaskStatus.PENDING, TaskStatus.RUNNING);

    SubTaskType getType();

    TaskStatus execute(SubTask subTask, String content);
}
