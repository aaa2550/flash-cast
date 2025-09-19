package com.flashcast.security;

import com.alibaba.fastjson2.JSON;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * 登录失败处理器：返回JSON格式的错误信息
 */
@Component
public class FormLoginFailedHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       AuthenticationException exception) throws IOException, ServletException {
        // 设置响应格式为JSON
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        
        // 构建错误响应
        Map<String, Object> result = new HashMap<>();
        result.put("code", 401);
        result.put("message", "登录失败：" + exception.getMessage());
        
        // 返回错误信息
        out.write(JSON.toJSONString(result));
        out.flush();
        out.close();
    }
}
