package com.flashcast.job;

import com.flashcast.service.TaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FlashCastJob {

    @Autowired
    private TaskService taskService;

    @Scheduled(cron = "0/5 * * * * ?")
    public void startTask() {
        log.info("startTask begin...");
        taskService.execSubTasks();
        log.info("startTask end...");
    }

    @Scheduled(cron = "0/5 * * * * ?")
    public void updateMainTask() {
        log.info("updateMainTask begin...");
        taskService.updateTasksProgress();
        log.info("updateMainTask end...");
    }

}
