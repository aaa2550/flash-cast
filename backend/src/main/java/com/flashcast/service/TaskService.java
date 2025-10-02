package com.flashcast.service;

import com.flashcast.convert.TaskConverter;
import com.flashcast.dto.DouyinUserInfo;
import com.flashcast.dto.Resource;
import com.flashcast.dto.RunningHubCallback;
import com.flashcast.dto.Task;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.enums.PixelType;
import com.flashcast.enums.TaskType;
import com.flashcast.response.R;
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

    String linkParse(String link);

    String rewrite(String content, String styles, String tone, String extraInstructions);

    String timbreSynthesis(String audioPath, String content, String emotionText);

    String videoSynthesis(String audioPath, String videoPath, PixelType pixelType);

    void publish(String videoPath, String title, String description);
}
