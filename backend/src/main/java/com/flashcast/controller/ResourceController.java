package com.flashcast.controller;

import com.flashcast.dto.Resource;
import com.flashcast.enums.ResourceType;
import com.flashcast.response.R;
import com.flashcast.service.ResourceService;
import com.flashcast.util.UserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @Operation(summary = "查询资源", description = "查询资源")
    @GetMapping("/list")
    public R<List<Resource>> list(@RequestParam("type") ResourceType resourceType,
                                  @RequestParam(value = "page", defaultValue = "1") Integer page,
                                  @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return R.success(resourceService.list(UserContext.getCurrentUserId(), resourceType, page, pageSize));
    }

    @Operation(summary = "查询资源", description = "查询资源")
    @PostMapping("/delete")
    public R<Void> delete(@RequestParam("id") Long id) {
        resourceService.remove(id);
        return R.success();
    }

}