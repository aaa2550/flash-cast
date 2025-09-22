package com.flashcast.controller;

import com.flashcast.dto.Style;
import com.flashcast.dto.StyleRequest;
import com.flashcast.response.R;
import com.flashcast.service.StyleService;
import com.flashcast.util.UserContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "风格", description = "风格")
@RestController
@RequestMapping("/style")
@Validated
@Slf4j
public class StyleController {

    @Autowired
    private StyleService styleService;

    @Operation(summary = "创建", description = "创建")
    @PostMapping("/create")
    public R<Long> create(@RequestBody StyleRequest request) {
        return R.success(styleService.create(request.getContent()));
    }

    @Operation(summary = "查询", description = "查询")
    @GetMapping("/list")
    public R<List<Style>> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                               @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return R.success(styleService.list(UserContext.getCurrentUserId(), page, pageSize));
    }

    @Operation(summary = "删除", description = "删除")
    @GetMapping("/delete")
    public R<Void> delete(@RequestParam("id") Long id) {
        styleService.delete(id);
        return R.success();
    }

}