package com.flashcast.repository;

import com.flashcast.convert.TaskConverter;
import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

public interface TaskRepository extends IService<TaskDO> {
    TaskConverter INSTANCE = Mappers.getMapper(TaskConverter.class);

    void add(Task task);
}
