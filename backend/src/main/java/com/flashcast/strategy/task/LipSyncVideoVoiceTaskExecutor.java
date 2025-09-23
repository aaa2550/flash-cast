package com.flashcast.strategy.task;

import com.alibaba.fastjson2.JSON;
import com.flashcast.dto.Resource;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.Task;
import com.flashcast.dto.TaskJsonModel;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.service.ResourceService;
import com.flashcast.service.SubTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LipSyncVideoVoiceTaskExecutor implements TaskExecutor {

    private final TaskType type = TaskType.LIP_SYNC_VIDEO_VOICE;

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private SubTaskService subTaskService;

    @Override
    public TaskType getType() {
        return type;
    }

    @Override
    public void execute(Task task) {
        TaskJsonModel model = JSON.parseObject(task.getJson(), TaskJsonModel.class);
        Resource videoResource = resourceService.get(model.getVideoId());
        Resource audioResource = resourceService.get(model.getAudioId());
        String resourcePath = resourceService.getResourcePath();
        model.setVideoPath(resourcePath + videoResource.getPath());
        model.setAudioPath(resourcePath + audioResource.getPath());
        SubTask subTask = new SubTask()
                .setMainTaskId(task.getId())
                .setType(SubTaskType.LIP_SYNC_VIDEO_VOICE)
                .setJson(JSON.toJSONString(model))
                .setStatus(TaskStatus.PENDING);
        subTaskService.add(subTask);
    }
}
