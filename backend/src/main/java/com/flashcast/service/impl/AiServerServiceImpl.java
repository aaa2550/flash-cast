package com.flashcast.service.impl;

import com.alibaba.fastjson2.JSON;
import com.flashcast.client.AiServerClient;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.SubmitBody;
import com.flashcast.dto.TaskInfoResponse;
import com.flashcast.dto.TaskJsonModel;
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

    private void post(SubTask subTask) {
        SubmitBody submitBody = new SubmitBody().setStrategy(subTask.getType().getStrategy());
        TaskJsonModel model = JSON.parseObject(subTask.getParameter(), TaskJsonModel.class);
        if (subTask.getType().equals(SubTaskType.LINK_PARSE)) {
            submitBody.put("link", model.getLink());
        } else if (subTask.getType().equals(SubTaskType.COPY_REPRODUCE)) {
            submitBody.put("text", model.getText());
        }

        aiServerClient.submit(submitBody);
    }

}
