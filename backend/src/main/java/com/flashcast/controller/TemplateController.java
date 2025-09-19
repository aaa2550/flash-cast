package com.flashcast.controller;

import com.flashcast.dto.Template;
import com.flashcast.dto.TemplateVO;
import com.flashcast.enums.TemplateType;
import com.flashcast.response.R;
import com.flashcast.service.TemplateService;
import com.mybatisflex.core.paginate.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "模版", description = "模版")
@RestController
@RequestMapping("/template")
@Validated
@Slf4j
public class TemplateController {

    @Autowired
    private TemplateService templateService;


    @Operation(summary = "查询", description = "查询")
    @PostMapping("/list")
    public R<Page<TemplateVO>> list(@RequestParam("type") TemplateType templateType,
                                    @RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "pageSize", defaultValue = "20") Integer pageSize) {
        return R.success(templateService.list(templateType, page, pageSize));
    }

}