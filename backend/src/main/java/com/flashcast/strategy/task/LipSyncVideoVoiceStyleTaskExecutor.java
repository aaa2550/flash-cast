package com.flashcast.strategy.task;

import com.alibaba.fastjson2.JSON;
import com.flashcast.dto.*;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.service.ResourceService;
import com.flashcast.service.StyleService;
import com.flashcast.service.SubTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LipSyncVideoVoiceStyleTaskExecutor implements TaskExecutor {
    private final TaskType type = TaskType.LIP_SYNC_VIDEO_VOICE_STYLE;

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private SubTaskService subTaskService;
    @Autowired
    private StyleService styleService;

    @Override
    public TaskType getType() {
        return type;
    }

    @Override
    public void execute(Task task) {

        TaskJsonModel model = JSON.parseObject(task.getJson(), TaskJsonModel.class);
        Style style = styleService.get(model.getStyleId());
        Resource videoResource = resourceService.get(model.getVideoId());
        Resource audioResource = resourceService.get(model.getAudioId());
        String resourcePath = resourceService.getResourcePath();
        model.setStyleContent(style.getContent());
        model.setVideoPath(resourcePath + videoResource.getPath());
        model.setAudioPath(resourcePath + audioResource.getPath());

        SubTask copyGenerationSubTask = new SubTask()
                .setMainTaskId(task.getId())
                .setType(SubTaskType.COPY_GENERATION)
                .setJson(JSON.toJSONString(model))
                .setStatus(TaskStatus.PENDING);
        subTaskService.add(copyGenerationSubTask);

        SubTask voiceSynthesisSubTask = new SubTask()
                .setMainTaskId(task.getId())
                .setType(SubTaskType.VOICE_SYNTHESIS)
                .setJson(JSON.toJSONString(model))
                .setStatus(TaskStatus.PENDING)
                .setDependOnIds(copyGenerationSubTask + "");
        subTaskService.add(voiceSynthesisSubTask);

        SubTask lipSyncVideoVoiceSubTask = new SubTask()
                .setMainTaskId(task.getId())
                .setType(SubTaskType.LIP_SYNC_VIDEO_VOICE)
                .setJson(JSON.toJSONString(model))
                .setStatus(TaskStatus.PENDING)
                .setDependOnIds(voiceSynthesisSubTask + "");
        subTaskService.add(lipSyncVideoVoiceSubTask);

    }
}
