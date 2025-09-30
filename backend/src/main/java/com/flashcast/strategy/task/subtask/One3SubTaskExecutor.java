package com.flashcast.strategy.task.subtask;

import com.flashcast.client.AiServerClient;
import com.flashcast.dto.GenerateResp;
import com.flashcast.dto.Resource;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.SubmitBody;
import com.flashcast.enums.ResourceType;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class One3SubTaskExecutor implements SubTaskExecutor {

    private final SubTaskType subTaskType = SubTaskType.COPY_REPRODUCE;

    @Autowired
    private AiServerClient aiServerClient;
    @Autowired
    private ResourceService resourceService;

    @Override
    public SubTaskType getType() {
        return subTaskType;
    }

    @Override
    public TaskStatus execute(SubTask subTask, String content) {

        List<Resource> resources = resourceService.findByTaskId(subTask.getMainTaskId());
        Map<ResourceType, Resource> resourceMap = resources.stream().collect(Collectors.toMap(Resource::getType, Function.identity()));
        Resource videoResource = resourceMap.get(ResourceType.VIDEO);
        Resource audioResource = resourceMap.get(ResourceType.AUDIO);

        aiServerClient.submit(new SubmitBody()
                .setStrategy(subTaskType.getStrategy())
                .put("text", content)
                .put("styles", "专业")
                .put("tone", null)    //语气倾向
                .put("extra_instructions", null)    //附加要求
        );



        while (true) {
            GenerateResp generateResp = aiServerClient.check(subTask.getId()).getData();
            if (!statuses.contains(generateResp.getTaskStatus())) {
                if (generateResp.getTaskStatus().equals(TaskStatus.SUCCESS)) {
                    subTask.setContent(generateResp.getResult());
                }
                return generateResp.getTaskStatus();
            }
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
