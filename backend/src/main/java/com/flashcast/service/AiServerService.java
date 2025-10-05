package com.flashcast.service;

import com.flashcast.dto.GenerateResp;
import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfoResponse;

import java.util.List;

public interface AiServerService {
    TaskInfoResponse queryServerTaskInfo();

    void post(List<SubTask> subTasks);

    String linkParse(Long subTaskId, String link);

    String rewrite(Long subTaskId, String content, String styles, String tone, String extraInstructions);

    GenerateResp check(Long subTaskId);
}
