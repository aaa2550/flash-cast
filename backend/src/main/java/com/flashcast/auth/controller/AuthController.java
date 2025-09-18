package com.flashcast.auth.controller;

import com.flashcast.auth.dto.LoginRequest;
import com.flashcast.auth.dto.LoginResponse;
import com.flashcast.auth.dto.RegisterRequest;
import com.flashcast.auth.dto.SendCodeRequest;
import com.flashcast.auth.entity.User;
import com.flashcast.auth.service.AuthService;
import com.flashcast.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

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
    private AuthService authService;

    /**
     * 发送验证码
     */
    @Operation(summary = "发送验证码", description = "向指定手机号发送验证码")
    @PostMapping("/send-code")
    public Result<Void> sendCode(@Valid @RequestBody SendCodeRequest request) {
        logger.info("发送验证码请求，手机号：{}", request.getPhone());
        
        boolean success = authService.sendVerifyCode(request);
        if (success) {
            return Result.success("验证码发送成功");
        } else {
            return Result.error("验证码发送失败");
        }
    }

    /**
     * 用户登录
     */
    @Operation(summary = "用户登录", description = "使用手机号和验证码登录")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("用户登录请求，手机号：{}", request.getPhone());
        
        LoginResponse response = authService.login(request);
        return Result.success("登录成功", response);
    }

    /**
     * 用户注册
     */
    @Operation(summary = "用户注册", description = "使用手机号、验证码和昵称注册新用户")
    @PostMapping("/register")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("用户注册请求，手机号：{}", request.getPhone());
        
        LoginResponse response = authService.register(request);
        return Result.success("注册成功", response);
    }

    /**
     * 登录或注册（自动注册）
     */
    @Operation(summary = "登录或注册", description = "如果用户存在则登录，不存在则自动注册")
    @PostMapping("/login-or-register")
    public Result<LoginResponse> loginOrRegister(@Valid @RequestBody LoginRequest request) {
        logger.info("登录或注册请求，手机号：{}", request.getPhone());
        
        LoginResponse response = authService.loginOrRegister(request);
        return Result.success("操作成功", response);
    }

    /**
     * 获取当前用户信息
     */
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的详细信息")
    @GetMapping("/profile")
    public Result<User> getProfile(
            @Parameter(description = "用户ID", hidden = true) 
            @RequestAttribute("userId") Long userId) {
        logger.info("获取用户信息请求，用户ID：{}", userId);
        
        User user = authService.getUserById(userId);
        return Result.success("获取成功", user);
    }

    /**
     * 更新用户信息
     */
    @Operation(summary = "更新用户信息", description = "更新当前登录用户的基本信息")
    @PutMapping("/profile")
    public Result<Void> updateProfile(
            @Parameter(description = "用户ID", hidden = true) 
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody User user) {
        logger.info("更新用户信息请求，用户ID：{}", userId);
        
        // 设置用户ID，防止越权操作
        user.setId(userId);
        
        boolean success = authService.updateUser(user);
        if (success) {
            return Result.success("更新成功");
        } else {
            return Result.error("更新失败");
        }
    }

    /**
     * 用户退出登录
     */
    @Operation(summary = "用户退出登录", description = "退出当前登录状态")
    @PostMapping("/logout")
    public Result<Void> logout(
            @Parameter(description = "用户ID", hidden = true) 
            @RequestAttribute("userId") Long userId,
            HttpServletRequest request) {
        logger.info("用户退出登录请求，用户ID：{}", userId);
        
        // 这里可以添加将token加入黑名单的逻辑
        // 目前JWT是无状态的，客户端删除token即可
        
        return Result.success("退出成功");
    }
}