package com.flashcast.controller;

import com.flashcast.dto.*;
import com.flashcast.enums.CheckResponse;
import com.flashcast.enums.TaskType;
import com.flashcast.response.R;
import com.flashcast.service.TaskService;
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
    //返回解析后的文案
    public R<Task> create(@RequestBody TaskCreateRequest request) {
        return R.success(taskService.create(TaskType.ONE_CLICK_CLONE2, request.getStartStep(), request.getJson()));
    }

    @Operation(summary = "解析视频文案", description = "解析视频文案")
    @PostMapping("/linkParse")
    //返回解析后的文案
    public R<Void> linkParse(@RequestBody LinkParseRequest request) {
        taskService.linkParse(request.getSubTaskId(), request.getLink());
        return R.success();
    }

    @Operation(summary = "重写文案", description = "重写文案")
    @PostMapping("/rewrite")
    //返回合成后的文案
    public R<Void> rewrite(@RequestBody RewriteRequest request) {
        taskService.rewrite(request.getSubTaskId(), request.getContent(), request.getStyles(), 
                          request.getTone(), request.getExtraInstructions());
        return R.success();
    }

    @Operation(summary = "查询状态", description = "查询状态")
    @GetMapping("/check")
    //返回合成后的文案
    public R<CheckResponse> check(@RequestParam("subTaskId") Long subTaskId) {
        return R.success(taskService.check(subTaskId));
    }

    @Operation(summary = "合成音频", description = "合成音频")
    @PostMapping("/timbreSynthesis")
    //返回合成后的音频url
    public R<Void> timbreSynthesis(@RequestBody TimbreSynthesisRequest request) {
        taskService.timbreSynthesis(request.getSubTaskId(), request.getAudioResourceId(), 
                                   request.getContent(), request.getEmotionText());
        return R.success();
    }

    @Operation(summary = "合成视频", description = "合成视频")
    @PostMapping("/videoSynthesis")
    //返回合成后的视频url
    public R<Void> videoSynthesis(@RequestBody VideoSynthesisRequest request) {
        taskService.videoSynthesis(request.getSubTaskId(), request.getAudioResourceId(), 
                                  request.getVideoResourceId(), request.getPixelType());
        return R.success();
    }

    @Operation(summary = "发布视频", description = "发布视频")
    @PostMapping("/publish")
    public R<Void> publish(@RequestBody PublishRequest request) {
        taskService.publish(request.getVideoPath(), request.getTitle(), request.getDescription());
        return R.success();
    }

}