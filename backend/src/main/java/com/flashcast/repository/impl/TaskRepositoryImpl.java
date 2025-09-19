package com.flashcast.repository.impl;

import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.flashcast.mapper.TaskMapper;
import com.flashcast.repository.TaskRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

@Repository
public class TaskRepositoryImpl extends ServiceImpl<TaskMapper, TaskDO> implements TaskRepository {

    @Override
    public void add(Task task) {
        TaskDO taskDO = C.convertToDO(task);
        save(taskDO);
        taskDO.setId(task.getId());
    }
}
