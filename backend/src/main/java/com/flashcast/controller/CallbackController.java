package com.flashcast.controller;

import com.flashcast.dto.RunningHubCallback;
import com.flashcast.response.R;
import com.flashcast.service.TaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "回调", description = "回调")
@RestController
@RequestMapping("/callback")
@Validated
@Slf4j
public class CallbackController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/runningHub")
    public R<Void> runningHub(@RequestBody RunningHubCallback callback) {
        taskService.runningHubCallback(callback);
        return R.success();
    }

}