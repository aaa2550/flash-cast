package com.flashcast.security;

import com.alibaba.fastjson2.JSON;
import com.flashcast.dto.User;
import com.flashcast.entity.UserDO;
import com.flashcast.util.JwtUtil;
import com.flashcast.response.R;
import com.flashcast.dto.LoginResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 登录成功处理器：返回JSON格式的认证信息
 */
@Component
public class FormLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       Authentication authentication) throws IOException, ServletException {
        // 设置响应格式为JSON
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        
        try {
            // 从认证信息中获取用户详情
            Object principal = authentication.getPrincipal();
            User user = null;
            UserDO userDO = null;
            
            if (principal instanceof UserDO) {
                userDO = (UserDO) principal;
                // 转换为DTO User对象用于JWT生成
                user = new User();
                user.setId(userDO.getId());
                user.setPhone(userDO.getPhone());
            } else {
                // 如果principal不是UserDO对象，创建简单对象
                user = new User();
                user.setPhone(authentication.getName());
                
                userDO = new UserDO();
                userDO.setPhone(authentication.getName());
            }
            
            // 生成JWT token
            String token = JwtUtil.generateToken(user);
            
            // 构建登录响应
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setUserDO(userDO);
            loginResponse.setToken(token);
            loginResponse.setTokenType("Bearer");
            loginResponse.setExpiresIn(86400L); // 24小时
            
            // 构建统一响应格式
            R<LoginResponse> result = R.success("登录成功", loginResponse);
            
            // 返回JSON数据
            out.write(JSON.toJSONString(result));
        } catch (Exception e) {
            // 如果出现异常，返回错误信息
            R<Object> errorResult = R.error("登录处理失败：" + e.getMessage());
            out.write(JSON.toJSONString(errorResult));
        }
        
        out.flush();
        out.close();
    }
}
