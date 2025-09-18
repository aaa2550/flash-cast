package com.flashcast.auth.service;

import com.flashcast.auth.dto.LoginRequest;
import com.flashcast.auth.dto.LoginResponse;
import com.flashcast.auth.dto.RegisterRequest;
import com.flashcast.auth.dto.SendCodeRequest;
import com.flashcast.auth.entity.User;

/**
 * 用户认证服务接口
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
public interface AuthService {

    /**
     * 发送验证码
     * 
     * @param request 发送验证码请求
     * @return 是否发送成功
     */
    boolean sendVerifyCode(SendCodeRequest request);

    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 登录响应，包含用户信息和令牌
     */
    LoginResponse login(LoginRequest request);

    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 注册响应，包含用户信息和令牌
     */
    LoginResponse register(RegisterRequest request);

    /**
     * 登录或注册（如果用户不存在则自动注册）
     * 
     * @param request 登录请求
     * @return 登录响应，包含用户信息和令牌
     */
    LoginResponse loginOrRegister(LoginRequest request);

    /**
     * 验证验证码是否正确
     * 
     * @param phone 手机号
     * @param verifyCode 验证码
     * @return 是否验证成功
     */
    boolean verifyCode(String phone, String verifyCode);
}