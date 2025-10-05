package com.flashcast.service.impl;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.flashcast.client.AiServerClient;
import com.flashcast.client.ComfyClient;
import com.flashcast.client.DouyinClient;
import com.flashcast.client.DownloadClient;
import com.flashcast.dto.*;
import com.flashcast.enums.*;
import com.flashcast.repository.TaskRepository;
import com.flashcast.service.*;
import com.flashcast.strategy.task.TaskExecutor;
import com.flashcast.strategy.task.subtask.SubTaskExecutor;
import com.flashcast.util.UserContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {

    @Value("${ai-server.max-task-num: 5}")
    private int maxTaskNum;
    @Value("${resource.path}")
    private String resourcePath;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private AiServerService aiServerService;
    @Autowired
    private UserService userService;
    @Autowired
    private SubTaskService subTaskService;
    @Autowired
    private RunningHubService runningHubService;
    @Autowired
    private List<TaskExecutor> taskExecutors;
    @Autowired
    private ComfyClient comfyClient;
    @Autowired
    private AiServerClient aiServerClient;
    @Autowired
    private DownloadClient downloadClient;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private DouyinClient douyinClient;
    @Autowired
    private List<SubTaskExecutor> subTaskExecutors;
    @Autowired
    private ThreadPoolExecutor threadPoolExecutor;
    private final Map<Long, PriorityTask> taskMap = new ConcurrentHashMap<>();

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
    public void execute(Task task) {
        Long taskId = task.getId();
        taskMap.computeIfAbsent(taskId, key -> {
            PriorityTask priorityTask = new PriorityTask(taskId.intValue(), () -> {
                execute(task.getId());
                taskMap.remove(taskId);
            });
            threadPoolExecutor.submit(priorityTask);
            return priorityTask;
        });

    }

    private void execute(Long taskId) {
        Task task = get(taskId);
        if (!task.getStatus().equals(TaskStatus.RUNNING) && !task.getStatus().equals(TaskStatus.PENDING)) {
            return;
        }
        String content = null;
        do {
            SubTask subTask = subTaskService.nextTask(taskId);
            if (subTask == null) {
                updateStatus(taskId, TaskStatus.SUCCESS);
                return;
            }
            try {
                TaskStatus status = getContent(subTask, content);
                if (status.equals(TaskStatus.SUCCESS)) {
                    content = subTask.getContent();
                    subTaskService.updateSuccessSubTask(subTask.getId(), subTask.getContent());
                    return;
                }
                if (status.equals(TaskStatus.CANCELED)) {
                    updateStatus(taskId, TaskStatus.FAILED);
                    subTaskService.updateStatus(subTask.getId(), TaskStatus.CANCELED);
                    return;
                }
                if (status.equals(TaskStatus.FAILED)) {
                    updateStatus(taskId, TaskStatus.FAILED);
                    subTaskService.updateStatus(subTask.getId(), TaskStatus.FAILED);
                    return;
                }
            } catch (Exception e) {
                log.error("execute error.taskId={}, subTask={}", taskId, subTask, e);
                updateStatus(taskId, TaskStatus.FAILED);
                subTaskService.updateStatus(subTask.getId(), TaskStatus.FAILED);
            }
        } while (true);
    }

    @Override
    public Task get(Long id) {
        return taskRepository.get(id);
    }

    @Override
    public void linkParse(Long subTaskId, String link) {
        subTaskService.updateStatus(subTaskId, TaskStatus.RUNNING);
        aiServerService.linkParse(subTaskId, link);
    }

    @Override
    public void rewrite(Long subTaskId, String content, String styles, String tone, String extraInstructions) {
        subTaskService.updateStatus(subTaskId, TaskStatus.RUNNING);
        aiServerService.rewrite(subTaskId, content, styles, tone, extraInstructions);
    }

    @Override
    public void timbreSynthesis(Long subTaskId, Long audioResourceId, String content, String emotionText) {
        subTaskService.updateStatus(subTaskId, TaskStatus.RUNNING);
        Resource resource = resourceService.get(audioResourceId);
        String runningHubId = runningHubService.timbreSynthesis(subTaskId, resourcePath + resource.getPath(), content, emotionText);
        subTaskService.updateRunningHubId(subTaskId, runningHubId);
    }

    @Override
    public void videoSynthesis(Long subTaskId, Long audioResourceId, Long videoResourceId, PixelType pixelType) {
        subTaskService.updateStatus(subTaskId, TaskStatus.RUNNING);
        // 通过资源ID获取资源路径
        String resourcePath = resourceService.getResourcePath();
        String audioPath = resourcePath + resourceService.get(audioResourceId).getPath();
        String videoPath = resourcePath + resourceService.get(videoResourceId).getPath();
        String runningHubId = runningHubService.videoSynthesis(audioPath, videoPath, pixelType);
        subTaskService.updateRunningHubId(subTaskId, runningHubId);
    }

    @Override
    public void publish(String videoPath, String title, String description) {

    }

    @Override
    public Task create(TaskType taskType, Integer startStep, String json) {
        Task task = new Task()
                .setType(taskType)
                .setJson(json)
                .setStartStep(startStep)
                .setStatus(TaskStatus.PENDING)
                .setUserId(UserContext.getCurrentUserId());
        taskRepository.add(task);

        List<SubTask> subTasks = new ArrayList<>();
        JSONArray jsonArray = JSON.parseArray(json);
        for (int i = 0; i < jsonArray.size(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            SubTaskType type = SubTaskType.valueOf(jsonObject.getString("type"));
            SubTask subTask = new SubTask().setMainTaskId(task.getId()).setType(type)
                    .setStatus(i < startStep ? TaskStatus.SUCCESS : TaskStatus.PENDING)
                    .setParameter(jsonObject.getString("parameter"))
                    .setSeq(i);
            subTasks.add(subTask);
            subTaskService.add(subTask);
        }

        task.setSubTasks(subTasks);
        return task;
    }

    @Override
    public CheckResponse check(Long subTaskId) {
        SubTask subTask = subTaskService.get(subTaskId);
        if (subTask.getType().equals(SubTaskType.LINK_PARSE)
                || subTask.getType().equals(SubTaskType.COPY_REPRODUCE)
                || subTask.getType().equals(SubTaskType.PUBLISH)) {
            GenerateResp generateResp = aiServerService.check(subTaskId);
            if (generateResp.getStatus().equals(TaskStatus.SUCCESS)) {
                subTaskService.updateSuccessSubTask(subTaskId, generateResp.getResult());
                return new CheckResponse(TaskStatus.SUCCESS, generateResp.getResult());
            }
            return new CheckResponse(generateResp.getStatus());
        }

        if (subTask.getType().equals(SubTaskType.TIMBRE_SYNTHESIS) || subTask.getType().equals(SubTaskType.VIDEO_SYNTHESIS)) {
            RunningHubStatus status = runningHubService.check(subTask.getRunningHubId());
            if (status.equals(RunningHubStatus.SUCCESS)) {
                String result = runningHubService.getResult(subTask.getRunningHubId());
                String path = downloadAndSave(subTaskId, result);
                Long resourceId = resourceService.add(path);
                subTaskService.updateSuccessSubTask(subTaskId, path);
                return new CheckResponse(TaskStatus.SUCCESS, resourceId + "");
            } else if (status.equals(RunningHubStatus.FAILED)) {
                return new CheckResponse(TaskStatus.FAILED);
            } else if (status.equals(RunningHubStatus.RUNNING)) {
                return new CheckResponse(TaskStatus.RUNNING);
            } else {
                return new CheckResponse(TaskStatus.PENDING);
            }
        }

        throw new RuntimeException("无法识别的类型");
    }

    public String downloadAndSave(Long subTaskId, String url) {
        // 1. 调用接口获取文件资源
        ResponseEntity<org.springframework.core.io.Resource> resourceResponseEntity = downloadClient.downloadFile(url);
        org.springframework.core.io.Resource resource = resourceResponseEntity.getBody();

        // 2. 确保保存目录存在
        Path dirPath = Paths.get(resourcePath);
        try {
            Files.createDirectories(dirPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String filename = Objects.requireNonNull(resource).getFilename();
        filename = File.separator + subTaskId + File.separator + filename;
        // 4. 保存到指定文件
        Path savePath = dirPath.resolve(filename);
        try {
            FileCopyUtils.copy(Objects.requireNonNull(resource).getInputStream(), Files.newOutputStream(savePath));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return filename;

    }

    private void updateStatus(Long taskId, TaskStatus taskStatus) {
        taskRepository.updateStatus(taskId, taskStatus);
    }

    private TaskStatus getContent(SubTask subTask, String content) {
        SubTaskExecutor subTaskExecutor = subTaskExecutors.stream().filter(e -> e.getType().equals(subTask.getType())).findFirst().orElseThrow();
        return subTaskExecutor.execute(subTask, content);
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

    @Override
    public void execTasks() {
        List<Task> tasks = scanPendingAndRunningTask();
        tasks.forEach(this::execute);
    }

    @Override
    public String getImageBase64(Long currentUserId) {
        return douyinClient.douyinGetImageBase64(currentUserId).getData();
    }

    @Override
    public void publish(Long taskId) {
        Task task = get(taskId);
        Resource resource = resourceService.get(task.getResultResourceId());
        douyinClient.douyinPublish(UserContext.getCurrentUserId(), task.getId(), resource.getPath());
    }

    @Override
    public DouyinStatus douyinCheck(Long taskId) {
        return douyinClient.douyinGetStatus(taskId).getData();
    }

    @Override
    public DouyinUserInfo douyinGetDouyinInfo(Long currentUserId) {
        User user = userService.get(currentUserId);
        if (!StringUtils.isBlank(user.getDouyinUserInfo())) {
            return JSON.parseObject(user.getDouyinUserInfo(), DouyinUserInfo.class);
        }
        DouyinUserInfo douyinUserInfo = douyinClient.douyinGetCookies(currentUserId).getData();
        if (douyinUserInfo.getStatus().equals(DouyinStatus.SUCCESS)) {
            userService.updateDouyinUserInfo(currentUserId, douyinUserInfo);
        }
        return douyinUserInfo;
    }

    @Override
    public void runningHubCallback(RunningHubCallback callback) {

    }

    private List<Task> scanPendingAndRunningTask() {
        return taskRepository.scanPendingAndRunningTask();
    }

    private void checkRunningTask(List<SubTask> subTasks) {
        for (SubTask subTask : subTasks) {
            if (subTask.getPlatformType().equals(CalcPlatformType.COMFY)) {
                GenerateResp generateResp = comfyClient.check(subTask.getId());
                if (generateResp.getStatus().equals(TaskStatus.SUCCESS) || generateResp.getStatus().equals(TaskStatus.FAILED) || generateResp.getStatus().equals(TaskStatus.CANCELED)) {
                    subTaskService.updateSuccessSubTask(subTask.getId(), generateResp.getResult());
                }
            }

            if (subTask.getPlatformType().equals(CalcPlatformType.LOCAL_PYTHON)) {
                GenerateResp generateResp = aiServerClient.check(subTask.getId()).getData();
                if (generateResp.getStatus().equals(TaskStatus.SUCCESS) || generateResp.getStatus().equals(TaskStatus.FAILED) || generateResp.getStatus().equals(TaskStatus.CANCELED)) {
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
