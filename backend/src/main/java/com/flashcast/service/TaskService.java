package com.flashcast.service;

import com.flashcast.convert.TaskConverter;
import com.flashcast.dto.DouyinUserInfo;
import com.flashcast.dto.RunningHubCallback;
import com.flashcast.dto.Task;
import com.flashcast.enums.CheckResponse;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.enums.PixelType;
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

    void runningHubCallback(RunningHubCallback callback);

    Task get(Long taskId);

    void linkParse(Long subTaskId, String link);

    void rewrite(Long subTaskId, String content, String styles, String tone, String extraInstructions);

    void timbreSynthesis(Long subTaskId, Long audioResourceId, String content, String emotionText);

    void videoSynthesis(Long subTaskId, Long audioResourceId, Long videoResourceId, PixelType pixelType);

    void publish(String videoPath, String title, String description);

    Task create(TaskType taskType, Integer startStep, String json);

    CheckResponse check(Long subTaskId);
}
