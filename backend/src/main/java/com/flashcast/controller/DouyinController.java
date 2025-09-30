package com.flashcast.controller;

import com.flashcast.dto.DouyinUserInfo;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.response.R;
import com.flashcast.service.TaskService;
import com.flashcast.util.UserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Tag(name = "抖音", description = "抖音")
@RestController
@RequestMapping("/douyin")
@Validated
@Slf4j
public class DouyinController {

    @Autowired
    private TaskService taskService;

    @Operation(summary = "查询base64", description = "查询base64")
    @GetMapping("/getImageBase64")
    public R<String> getImageBase64() {
        return R.success(taskService.getImageBase64(UserContext.getCurrentUserId()));
    }

    @Operation(summary = "获取抖音用户信息", description = "获取抖音用户信息")
    @GetMapping("/douyinGetDouyinInfo")
    public R<DouyinUserInfo> douyinGetDouyinInfo() {
        return R.success(taskService.douyinGetDouyinInfo(UserContext.getCurrentUserId()));
    }

    @Operation(summary = "发布", description = "发布")
    @PostMapping("/publish")
    public R<String> publish(@RequestParam("taskId") Long taskId) {
        taskService.publish(taskId);
        return R.success();
    }

    @Operation(summary = "发布", description = "发布")
    @GetMapping("/check")
    public R<DouyinStatus> check(@RequestParam("taskId") Long taskId) {
        return R.success(taskService.douyinCheck(taskId));
    }

}