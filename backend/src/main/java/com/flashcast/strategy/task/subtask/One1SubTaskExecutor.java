package com.flashcast.strategy.task.subtask;

import com.flashcast.client.AiServerClient;
import com.flashcast.dto.GenerateResp;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.SubmitBody;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class One1SubTaskExecutor implements SubTaskExecutor {

    private final SubTaskType subTaskType = SubTaskType.LINK_PARSE;

    @Autowired
    private AiServerClient aiServerClient;

    @Override
    public SubTaskType getType() {
        return subTaskType;
    }

    @Override
    public TaskStatus execute(SubTask subTask, String content) {
        aiServerClient.submit(new SubmitBody()
                .setStrategy(subTaskType.getStrategy())
                .put("link", subTask.getParameter()));

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
