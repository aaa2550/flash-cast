package com.flashcast.security;

import com.alibaba.fastjson2.JSON;
import com.flashcast.dto.LoginResponse;
import com.flashcast.dto.User;
import com.flashcast.response.R;
import com.flashcast.service.UserService;
import com.flashcast.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 登录成功处理器：返回JSON格式的认证信息
 */
@Component
public class FormLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // 设置响应格式为JSON
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();

        User user = userService.getUser(authentication.getName());

        // 生成JWT token
        String token = JwtUtil.generateToken(user);

        // 构建登录响应
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserDO(user);
        loginResponse.setToken(token);
        loginResponse.setTokenType("Bearer");
        loginResponse.setExpiresIn(86400L); // 24小时

        // 构建统一响应格式
        R<LoginResponse> result = R.success("登录成功", loginResponse);

        // 返回JSON数据
        out.write(JSON.toJSONString(result));

        out.flush();
        out.close();
    }
}
