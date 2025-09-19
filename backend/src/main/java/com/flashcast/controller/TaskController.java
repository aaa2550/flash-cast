package com.flashcast.controller;

import com.flashcast.dto.TaskRequest;
import com.flashcast.response.R;
import com.flashcast.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Tag(name = "任务", description = "任务")
@RestController
@RequestMapping("/task")
@Validated
@Slf4j
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Operation(summary = "创建任务", description = "创建任务")
    @PostMapping("/create")
    public R<Void> create(@Valid @RequestBody TaskRequest request) {
        taskService.create(request.getType(), request.getJson());
        return R.success();
    }

}