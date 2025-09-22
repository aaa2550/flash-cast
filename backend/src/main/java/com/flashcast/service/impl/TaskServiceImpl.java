package com.flashcast.service.impl;

import com.flashcast.client.AiServerClient;
import com.flashcast.client.ComfyClient;
import com.flashcast.dto.*;
import com.flashcast.enums.CalcPlatformType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.repository.TaskRepository;
import com.flashcast.service.AiServerService;
import com.flashcast.service.SubTaskService;
import com.flashcast.service.TaskService;
import com.flashcast.strategy.task.TaskExecutor;
import com.flashcast.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Value("${ai-server.max-task-num: 5}")
    private int maxTaskNum;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private AiServerService aiServerService;
    @Autowired
    private SubTaskService subTaskService;
    @Autowired
    private List<TaskExecutor> taskExecutors;
    @Autowired
    private ComfyClient comfyClient;
    @Autowired
    private AiServerClient aiServerClient;

    @Override
    public void create(TaskType type, String json) {

        Task task = new Task()
                .setType(type)
                .setJson(json)
                .setStatus(TaskStatus.PENDING)
                .setUserId(UserContext.getCurrentUserId());
        taskRepository.add(task);

        taskExecutors.stream().filter(e -> e.getType().equals(type)).findFirst().orElseThrow().execute(task);
    }

    @Override
    public void execSubTasks() {
        TaskInfoResponse taskInfoResponse = aiServerService.queryServerTaskInfo();
        List<TaskInfo> subTaskInfos = taskInfoResponse.getTasks();
        subTaskService.revokeInvalidStatesByExcludeIds(subTaskInfos.stream().map(TaskInfo::getId).toList());
        subTaskService.updateSuccessSubTasks(subTaskInfos);
        execTasks(maxTaskNum - taskInfoResponse.getTasks().size());
    }

    @Override
    public void updateTasksProgress() {
        List<Task> tasks = scanRunningTask();
        List<SubTask> allSubTasks = getSubTaskByMainIds(C.toIds(tasks));
        Map<Long, List<SubTask>> taskGroupMap = allSubTasks.stream().collect(Collectors.groupingBy(SubTask::getMainTaskId));
        tasks.forEach(task -> {
            List<SubTask> subTasks = taskGroupMap.get(task.getId());
            checkRunningTask(subTasks.stream().filter(e -> e.getStatus().equals(TaskStatus.RUNNING)).toList());
            updateTasksProgress(task, subTasks);
        });
    }

    private void checkRunningTask(List<SubTask> subTasks) {
        for (SubTask subTask : subTasks) {
            if (subTask.getPlatformType().equals(CalcPlatformType.COMFY)) {
                GenerateResp generateResp = comfyClient.check(subTask.getId());
                if (generateResp.getTaskStatus().equals(TaskStatus.SUCCESS) || generateResp.getTaskStatus().equals(TaskStatus.FAILED) || generateResp.getTaskStatus().equals(TaskStatus.CANCELED)) {
                    subTaskService.updateSuccessSubTask(subTask.getId(), generateResp.getResult());
                }
            }

            if (subTask.getPlatformType().equals(CalcPlatformType.LOCAL_PYTHON)) {
                GenerateResp generateResp = aiServerClient.check(subTask.getId());
                if (generateResp.getTaskStatus().equals(TaskStatus.SUCCESS) || generateResp.getTaskStatus().equals(TaskStatus.FAILED) || generateResp.getTaskStatus().equals(TaskStatus.CANCELED)) {
                    subTaskService.updateSuccessSubTask(subTask.getId(), generateResp.getResult());
                }
            }
        }
    }

    private void updateTasksProgress(Task task, List<SubTask> subTasks) {
        if (subTasks.stream().anyMatch(s -> s.getStatus().equals(TaskStatus.PENDING) || s.getStatus().equals(TaskStatus.RUNNING))) {
            long success = subTasks.stream().filter(e -> e.getStatus().equals(TaskStatus.SUCCESS)).count();
            taskRepository.updateProgress(task.getId(), (int) (success * 100 / subTasks.size()));
            return;
        }

        if (subTasks.stream().anyMatch(s -> s.getStatus().equals(TaskStatus.FAILED))) {
            taskRepository.updateStatus(task.getId(), TaskStatus.FAILED);
            return;
        }

        if (subTasks.stream().anyMatch(s -> s.getStatus().equals(TaskStatus.CANCELED))) {
            taskRepository.updateStatus(task.getId(), TaskStatus.CANCELED);
            return;
        }

        taskRepository.updateStatus(task.getId(), TaskStatus.SUCCESS);
    }

    private List<SubTask> getSubTaskByMainIds(List<Long> taskIds) {
        return subTaskService.getSubTaskByMainIds(taskIds);
    }

    private List<Task> scanRunningTask() {
        return taskRepository.scanRunningTask();
    }

    private void execTasks(int execTaskNum) {
        Long maxId = Long.MAX_VALUE;
        while (execTaskNum > 0) {
            SubTask subTask = subTaskService.getLastPending(maxId);
            if (post(subTask)) {
                execTaskNum--;
            }
            maxId = subTask.getId();
        }
    }

    private boolean post(SubTask subTask) {
        List<Long> dependOnIds = Arrays.stream(subTask.getDependOnIds().split(",")).map(Long::valueOf).toList();
        if (dependOnIds.isEmpty()) {
            aiServerService.post(List.of(subTask));
            return true;
        }
        List<SubTask> subTasks = subTaskService.find(dependOnIds);
        if (subTasks.stream().allMatch(e -> e.getStatus().equals(TaskStatus.SUCCESS))) {
            aiServerService.post(List.of(subTask));
            return true;
        }
        if (subTasks.stream().anyMatch(e -> e.getStatus().equals(TaskStatus.FAILED))) {
            subTaskService.updateStatus(subTask.getId(), TaskStatus.FAILED);
            return false;
        }
        return false;
    }

}
