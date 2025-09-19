package com.flashcast.service.impl;

import com.flashcast.dto.Task;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.repository.TaskRepository;
import com.flashcast.service.TaskService;
import com.flashcast.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public void create(TaskType type, String json) {
        taskRepository.add(new Task()
                .setType(type)
                .setJson(json)
                .setStatus(TaskStatus.PENDING)
                .setUserId(UserContext.getCurrentUserId()));
    }
}
