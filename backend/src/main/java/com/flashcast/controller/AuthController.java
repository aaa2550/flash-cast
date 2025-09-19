package com.flashcast.controller;

import com.flashcast.dto.SendCodeRequest;
import com.flashcast.response.R;
import com.flashcast.service.LocalCacheService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户认证控制器
 *
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Tag(name = "用户认证", description = "用户认证相关接口")
@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private LocalCacheService localCacheService;

    /**
     * 发送验证码
     */
    @Operation(summary = "发送验证码", description = "向指定手机号发送验证码")
    @PostMapping("/sendCode")
    public R<Void> sendCode(@Valid @RequestBody SendCodeRequest request) {
        localCacheService.sendVerifyCode(request.getPhone());
        return R.success("验证码发送成功");
    }

}