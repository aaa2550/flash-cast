package com.flashcast.security;

import com.alibaba.fastjson2.JSON;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * 权限不足处理器：处理用户访问无权限资源的情况
 */
@Component
public class AuthenticationAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, 
                      HttpServletResponse response, 
                      AccessDeniedException accessDeniedException) throws IOException, ServletException {
        // 设置响应格式为JSON
        response.setContentType("application/json;charset=utf-8");
        // 设置403状态码
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        PrintWriter out = response.getWriter();
        
        // 构建权限不足响应
        Map<String, Object> result = new HashMap<>();
        result.put("code", 403);
        result.put("message", "权限不足：" + accessDeniedException.getMessage());
        
        // 返回错误信息
        out.write(JSON.toJSONString(result));
        out.flush();
        out.close();
    }
}
