package com.flashcast.service;

import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfo;
import com.flashcast.enums.TaskStatus;

import java.util.List;

public interface SubTaskService {
    void revokeInvalidStatesByExcludeIds(List<Long> runningTaskIds);

    List<SubTask> scanPendingTasks(int execTaskNum);

    List<SubTask> getSubTaskByMainIds(List<Long> taskIds);

    void updateSuccessSubTasks(List<TaskInfo> subTaskInfos);

    SubTask getLastPending(Long preId);

    List<SubTask> find(List<Long> dependOnIds);

    void updateStatus(Long id, TaskStatus taskStatus);

    void add(SubTask subTask);

    void updateSuccessSubTask(Long id, String content);

    SubTask nextTask(Long taskId);

    void updateStatusAll(Long taskId, TaskStatus taskStatus);

    void updateRunningHubId(Long subTaskId, String runningHubId);

    SubTask get(Long subTaskId);
}
