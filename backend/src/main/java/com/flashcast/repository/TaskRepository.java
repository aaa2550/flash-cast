package com.flashcast.repository;

import com.flashcast.convert.TaskConverter;
import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.flashcast.enums.TaskStatus;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface TaskRepository extends IService<TaskDO> {
    TaskConverter C = Mappers.getMapper(TaskConverter.class);

    void add(Task task);

    List<Task> find(int execTaskNum);

    List<Task> scanRunningTask();

    void updateStatus(Long id, TaskStatus taskStatus);

    void updateProgress(Long id, int progress);

    List<Task> scanPendingAndRunningTask();

    Task get(Long id);
}
