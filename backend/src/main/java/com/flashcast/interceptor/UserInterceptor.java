package com.flashcast.interceptor;

import com.flashcast.dto.User;
import com.flashcast.util.JwtUtil;
import com.flashcast.util.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Order(1)
@Component
public class UserInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             @NotNull HttpServletResponse response,
                             @NotNull Object handler) {

        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isBlank(authorization)) {
            return true;
        }
        try {
            User user = JwtUtil.parseToken(authorization.substring("Bearer ".length()));
            UserContext.set(user);
            log.info("UserInterceptor - 设置用户上下文: {}", user.getPhone());
        } catch (Exception e) {
            log.warn("UserInterceptor - JWT解析失败: {}", e.getMessage());
        }
        return true; // 继续执行
    }

    @Override
    public void afterCompletion(@NotNull HttpServletRequest request,
                                @NotNull HttpServletResponse response,
                                @NotNull Object handler,
                                Exception ex) {
        String requestURI = request.getRequestURI();
        log.debug("UserInterceptor - 清理用户上下文，请求路径: {}", requestURI);
        UserContext.remove();
    }
}