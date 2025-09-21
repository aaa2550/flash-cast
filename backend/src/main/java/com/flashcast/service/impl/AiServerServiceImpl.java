package com.flashcast.service.impl;

import com.flashcast.client.AiServerClient;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfoResponse;
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
        return aiServerClient.queryServerTaskInfo();
    }

    @Override
    public void post(List<SubTask> subTasks) {
        subTasks.forEach(this::post);
    }

    private void post(SubTask subTask) {
        aiServerClient.submit(subTask);
    }
}
