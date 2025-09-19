package com.flashcast.controller;

import com.flashcast.dto.Resource;
import com.flashcast.response.R;
import com.flashcast.service.ResourceService;
import com.flashcast.util.UserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    public R<Resource> upload(@RequestParam("file") MultipartFile file) {
        return R.success(resourceService.upload(file, UserContext.getCurrentUserId()));
    }

}