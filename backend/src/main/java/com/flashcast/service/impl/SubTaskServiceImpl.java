package com.flashcast.service.impl;

import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfo;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.repository.SubTaskRepository;
import com.flashcast.service.SubTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubTaskServiceImpl implements SubTaskService {

    @Autowired
    private SubTaskRepository subTaskRepository;

    @Override
    public void revokeInvalidStatesByExcludeIds(List<Long> runningTaskIds) {
        subTaskRepository.revokeInvalidStates(runningTaskIds, List.of(TaskType.LIP_SYNC_VIDEO_VOICE_STYLE));
    }

    @Override
    public List<SubTask> scanPendingTasks(int execTaskNum) {
        return subTaskRepository.scanPendingTasks(execTaskNum);
    }

    @Override
    public List<SubTask> getSubTaskByMainIds(List<Long> taskIds) {
        return subTaskRepository.getSubTaskByMainIds(taskIds);
    }

    @Override
    public void updateSuccessSubTasks(List<TaskInfo> subTaskInfos) {
        subTaskInfos.forEach(task -> {
            if (task.getStatus().equals(TaskStatus.SUCCESS)) {
                subTaskRepository.updateSuccess(task.getId(), task.getContent());
            } else if (task.getStatus().equals(TaskStatus.FAILED)) {
                subTaskRepository.updateStatus(task.getId(), TaskStatus.FAILED);
            }
        });
    }

    @Override
    public SubTask getLastPending(Long preId) {
        return subTaskRepository.getLastPending(preId);
    }

    @Override
    public List<SubTask> find(List<Long> dependOnIds) {
        return subTaskRepository.find(dependOnIds);
    }

    @Override
    public void updateStatus(Long id, TaskStatus taskStatus) {
        subTaskRepository.updateStatus(id, taskStatus);
    }

    @Override
    public void add(SubTask subTask) {
        subTaskRepository.add(subTask);
    }

    @Override
    public void updateSuccessSubTask(Long id, String content) {
        subTaskRepository.updateSuccess(id, content);
    }

    @Override
    public SubTask nextTask(Long taskId) {
        return subTaskRepository.getNext(taskId);
    }

    @Override
    public void updateStatusAll(Long taskId, TaskStatus taskStatus) {
        subTaskRepository.updateStatusAll(taskId, taskStatus);
    }

    @Override
    public void updateRunningHubId(Long subTaskId, String runningHubId) {
        subTaskRepository.updateRunningHubId(subTaskId, runningHubId);
    }

    @Override
    public SubTask get(Long subTaskId) {
        return subTaskRepository.get(subTaskId);
    }
}
