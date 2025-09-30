package com.flashcast.service;

import com.flashcast.convert.TaskConverter;
import com.flashcast.dto.DouyinUserInfo;
import com.flashcast.dto.Task;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.enums.TaskType;
import org.mapstruct.factory.Mappers;

public interface TaskService {
    TaskConverter C = Mappers.getMapper(TaskConverter.class);

    void create(TaskType type, String json);

    void execute(Task task);

    void execSubTasks();

    void updateTasksProgress();

    void execTasks();

    String getImageBase64(Long currentUserId);

    void publish(Long taskId);

    DouyinStatus douyinCheck(Long taskId);

    DouyinUserInfo douyinGetDouyinInfo(Long currentUserId);
}
