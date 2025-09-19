package com.flashcast.controller;

import com.flashcast.dto.TaskRequest;
import com.flashcast.response.R;
import com.flashcast.service.ResourceService;
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

@Tag(name = "资源", description = "资源")
@RestController
@RequestMapping("/resource")
@Validated
@Slf4j
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @Operation(summary = "上传文件", description = "上传文件")
    @PostMapping("/upload")
    public R<Void> upload(@Valid @RequestBody TaskRequest request) {
        return R.success();
    }

}