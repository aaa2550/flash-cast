package com.flashcast.auth.interceptor;

import cn.hutool.core.util.StrUtil;
import com.flashcast.auth.util.JwtUtil;
import com.flashcast.common.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT认证拦截器
 * 用于拦截需要认证的请求，验证JWT令牌的有效性
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthInterceptor.class);

    /**
     * JWT令牌在请求头中的字段名
     */
    private static final String AUTHORIZATION_HEADER = "Authorization";

    /**
     * JWT令牌前缀
     */
    private static final String TOKEN_PREFIX = "Bearer ";

    /**
     * 用户ID在请求属性中的键名
     */
    public static final String USER_ID_ATTRIBUTE = "userId";

    /**
     * 用户手机号在请求属性中的键名
     */
    public static final String USER_PHONE_ATTRIBUTE = "userPhone";

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 获取请求路径
        String requestURI = request.getRequestURI();
        
        // 记录请求信息
        logger.debug("JWT认证拦截器处理请求：{} {}", request.getMethod(), requestURI);

        try {
            // 从请求头获取JWT令牌
            String token = extractTokenFromRequest(request);
            
            if (StrUtil.isBlank(token)) {
                logger.warn("请求缺少JWT令牌，路径：{}", requestURI);
                throw new BusinessException("缺少认证令牌");
            }

            // 验证JWT令牌
            if (!jwtUtil.validateToken(token)) {
                logger.warn("JWT令牌验证失败，路径：{}", requestURI);
                throw new BusinessException("认证令牌无效");
            }

            // 检查令牌是否过期
            if (jwtUtil.isTokenExpired(token)) {
                logger.warn("JWT令牌已过期，路径：{}", requestURI);
                throw new BusinessException("认证令牌已过期");
            }

            // 从令牌中提取用户信息
            Long userId = jwtUtil.getUserIdFromToken(token);
            String userPhone = jwtUtil.getPhoneFromToken(token);

            if (userId == null) {
                logger.warn("从JWT令牌中无法解析用户ID，路径：{}", requestURI);
                throw new BusinessException("认证令牌格式错误");
            }

            // 将用户信息存储到请求属性中，供后续处理使用
            request.setAttribute(USER_ID_ATTRIBUTE, userId);
            request.setAttribute(USER_PHONE_ATTRIBUTE, userPhone);

            logger.debug("JWT认证成功，用户ID：{}，手机号：{}，路径：{}", userId, userPhone, requestURI);
            return true;

        } catch (BusinessException e) {
            // 业务异常直接抛出
            throw e;
        } catch (Exception e) {
            logger.error("JWT认证拦截器处理异常，路径：{}", requestURI, e);
            throw new BusinessException("认证失败");
        }
    }

    /**
     * 从请求中提取JWT令牌
     * 
     * @param request HTTP请求对象
     * @return JWT令牌字符串，如果没有找到则返回null
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        // 优先从Authorization头获取
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (StrUtil.isNotBlank(authHeader) && authHeader.startsWith(TOKEN_PREFIX)) {
            return authHeader.substring(TOKEN_PREFIX.length());
        }

        // 其次从URL参数获取（用于某些特殊场景，如文件下载）
        String tokenParam = request.getParameter("token");
        if (StrUtil.isNotBlank(tokenParam)) {
            return tokenParam;
        }

        return null;
    }

    /**
     * 从请求中获取当前登录用户ID
     * 该方法需要在拦截器处理后调用
     * 
     * @param request HTTP请求对象
     * @return 用户ID
     */
    public static Long getCurrentUserId(HttpServletRequest request) {
        Object userId = request.getAttribute(USER_ID_ATTRIBUTE);
        return userId != null ? (Long) userId : null;
    }

    /**
     * 从请求中获取当前登录用户手机号
     * 该方法需要在拦截器处理后调用
     * 
     * @param request HTTP请求对象
     * @return 用户手机号
     */
    public static String getCurrentUserPhone(HttpServletRequest request) {
        Object userPhone = request.getAttribute(USER_PHONE_ATTRIBUTE);
        return userPhone != null ? (String) userPhone : null;
    }
}