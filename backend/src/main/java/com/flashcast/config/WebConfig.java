package com.flashcast.config;

import com.flashcast.interceptor.UserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
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

    @Value("${spring.web.resources.static-locations}")
    private String staticLocations;
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
                        "/resource/**",


                        // 模版相关接口全部放开认证，彻底解决CORS问题
                        "/api/template/**",

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
    registry
        .addMapping("/**")
        .allowedOriginPatterns("*")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resource/**")
                .addResourceLocations(staticLocations);
    }
}