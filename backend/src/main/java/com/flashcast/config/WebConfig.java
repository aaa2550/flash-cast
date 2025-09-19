package com.flashcast.config;

import com.flashcast.interceptor.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类
 * 负责配置拦截器、跨域等Web相关设置
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private UserInterceptor userInterceptor;

    /**
     * 配置拦截器
     * 
     * @param registry 拦截器注册表
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userInterceptor)
                // 需要认证的路径
                .addPathPatterns("/api/**")
                // 排除不需要认证的路径
                .excludePathPatterns(
                        // 认证相关接口
                        "/api/auth/send-code",
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/auth/login-or-register",
                        
                        // 系统相关接口
                        "/api/health",
                        "/api/version",
                        
                        // 静态资源
                        "/static/**",
                        "/public/**",
                        
                        // Swagger文档
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/webjars/**",
                        
                        // 错误页面
                        "/error"
                );
    }

    /**
     * 配置跨域
     * 
     * @param registry 跨域注册表
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 允许的源
                .allowedOriginPatterns("*")
                // 允许的HTTP方法
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                // 允许的请求头
                .allowedHeaders("*")
                // 允许发送Cookie
                .allowCredentials(true)
                // 预检请求的有效期（秒）
                .maxAge(3600);
    }
}