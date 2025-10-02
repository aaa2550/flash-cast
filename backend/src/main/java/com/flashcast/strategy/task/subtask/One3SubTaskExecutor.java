package com.flashcast.strategy.task.subtask;

import com.alibaba.fastjson2.JSON;
import com.flashcast.dto.Resource;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.Task;
import com.flashcast.dto.TaskModel;
import com.flashcast.enums.ResourceType;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.service.ResourceService;
import com.flashcast.service.RunningHubService;
import com.flashcast.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class One3SubTaskExecutor implements SubTaskExecutor {

    private final SubTaskType subTaskType = SubTaskType.TIMBRE_SYNTHESIS;

    @Autowired
    private RunningHubService runningHubService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private TaskService taskService;

    @Override
    public SubTaskType getType() {
        return subTaskType;
    }

    @Override
    public TaskStatus execute(SubTask subTask, String content) {

        Task task = taskService.get(subTask.getMainTaskId());
        TaskModel taskModel = JSON.parseObject(task.getJson(), TaskModel.class);
        List<Resource> resources = resourceService.findByTaskId(subTask.getMainTaskId());
        Map<ResourceType, Resource> resourceMap = resources.stream().collect(Collectors.toMap(Resource::getType, Function.identity()));
        Resource audioResource = resourceMap.get(ResourceType.AUDIO);

        String result = runningHubService.timbreSynthesis(audioResource.getPath(), content, taskModel.getEmotionText());
        return result == null ? TaskStatus.FAILED : TaskStatus.SUCCESS;
    }

}
