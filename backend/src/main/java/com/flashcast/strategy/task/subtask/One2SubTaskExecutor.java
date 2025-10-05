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
public class One2SubTaskExecutor implements SubTaskExecutor {

    private final SubTaskType subTaskType = SubTaskType.COPY_REPRODUCE;

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
                .put("text", content)
                .put("styles", "专业")
                .put("tone", null)    //语气倾向
                .put("extra_instructions", null)    //附加要求
        );

        while (true) {
            GenerateResp generateResp = aiServerClient.check(subTask.getId()).getData();
            if (!statuses.contains(generateResp.getStatus())) {
                if (generateResp.getStatus().equals(TaskStatus.SUCCESS)) {
                    subTask.setContent(generateResp.getResult());
                }
                return generateResp.getStatus();
            }
            try {
                Thread.sleep(1000L);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
