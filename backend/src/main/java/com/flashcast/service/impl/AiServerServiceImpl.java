package com.flashcast.service.impl;

import com.alibaba.fastjson2.JSON;
import com.flashcast.client.AiServerClient;
import com.flashcast.dto.*;
import com.flashcast.enums.SubTaskType;
import com.flashcast.service.AiServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiServerServiceImpl implements AiServerService {

    @Value("${ai-server.max-task-num: 4}")
    private int maxTaskNum;
    @Autowired
    private AiServerClient aiServerClient;

    @Override
    public TaskInfoResponse queryServerTaskInfo() {
        return aiServerClient.queryServerTaskInfo().getData();
    }

    @Override
    public void post(List<SubTask> subTasks) {
        subTasks.forEach(this::post);
    }

    @Override
    public String linkParse(Long subTaskId, String link) {
        return aiServerClient.submit(new SubmitBody().setStrategy(SubTaskType.LINK_PARSE.getStrategy())
                .put("link", link)
                .put("taskId", subTaskId)
        ).getData();
    }

    @Override
    public String rewrite(Long subTaskId, String content, String styles, String tone, String extraInstructions) {
        return aiServerClient.submit(new SubmitBody().setStrategy(SubTaskType.COPY_REPRODUCE.getStrategy())
                .put("taskId", subTaskId)
                .put("text", content)
                .put("styles", styles)
                .put("tone", tone)
                .put("extraInstructions", extraInstructions)
        ).getData();
    }

    @Override
    public GenerateResp check(Long subTaskId) {
        return aiServerClient.check(subTaskId).getData();
    }

    private void post(SubTask subTask) {
        SubmitBody submitBody = new SubmitBody().setStrategy(subTask.getType().getStrategy());
        TaskJsonModel model = JSON.parseObject(subTask.getParameter(), TaskJsonModel.class);
        if (subTask.getType().equals(SubTaskType.LINK_PARSE)) {
            submitBody.put("taskId", subTask.getId());
            submitBody.put("link", model.getLink());
        } else if (subTask.getType().equals(SubTaskType.COPY_REPRODUCE)) {
            submitBody.put("taskId", subTask.getId());
            submitBody.put("text", model.getText());
        }

        aiServerClient.submit(submitBody);
    }

}
