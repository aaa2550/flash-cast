package com.flashcast.service;

import com.flashcast.convert.TaskConverter;
import com.flashcast.enums.TaskType;
import org.mapstruct.factory.Mappers;

public interface TaskService {
    TaskConverter C = Mappers.getMapper(TaskConverter.class);

    void create(TaskType type, String json);

    void execSubTasks();

    void updateTasksProgress();

}
