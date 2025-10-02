package com.flashcast.controller;

import com.flashcast.dto.TaskRequest;
import com.flashcast.enums.PixelType;
import com.flashcast.response.R;
import com.flashcast.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

    @Operation(summary = "解析视频文案", description = "解析视频文案")
    @PostMapping("/linkParse")
    //返回解析后的文案
    public R<String> linkParse(@RequestParam("link") String link//抖音链接
    ) {
        return R.success(taskService.linkParse(link));
    }

    @Operation(summary = "重写文案", description = "重写文案")
    @PostMapping("/rewrite")
    //返回合成后的文案
    public R<String> rewrite(@RequestParam("content") String content,   //原内容
                             @RequestParam("styles") String styles, //风格
                             @RequestParam("tone") String tone, //语气倾向
                             @RequestParam("extraInstructions") String extraInstructions //附加要求
                             ) {
        return R.success(taskService.rewrite(content, styles, tone, extraInstructions));
    }

    @Operation(summary = "合成音频", description = "合成音频")
    @PostMapping("/timbreSynthesis")
    //返回合成后的音频url
    public R<String> timbreSynthesis(@RequestParam("audioPath") String audioPath,//参考音色
                                     @RequestParam("content") String content,//文本内容
                                     @RequestParam("emotionText") String emotionText//情绪描述词
    ) {
        return R.success(taskService.timbreSynthesis(audioPath, content, emotionText));
    }

    @Operation(summary = "合成视频", description = "合成视频")
    @PostMapping("/videoSynthesis")
    //返回合成后的视频url
    public R<String> videoSynthesis(@RequestParam("audioPath") String audioPath,//音色
                                    @RequestParam("videoPath") String videoPath,//视频
                                    @RequestParam("pixelType") PixelType pixelType//生成画面比例
    ) {
        return R.success(taskService.videoSynthesis(audioPath, videoPath, pixelType));
    }

    @Operation(summary = "发布视频", description = "发布视频")
    @PostMapping("/publish")
    public R<Void> publish(@RequestParam("videoPath") String videoPath,//待上传
                             @RequestParam(value = "title", required = false) String title,//标题
                             @RequestParam(value = "description", required = false) String description//描述
    ) {
        taskService.publish(videoPath, title, description);
        return R.success();
    }

}