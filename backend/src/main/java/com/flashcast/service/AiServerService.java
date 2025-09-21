package com.flashcast.service;

import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfoResponse;

import java.util.List;

public interface AiServerService {
    TaskInfoResponse queryServerTaskInfo();

    void post(List<SubTask> subTasks);
}
