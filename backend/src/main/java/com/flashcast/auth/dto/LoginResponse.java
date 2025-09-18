package com.flashcast.auth.dto;

import com.flashcast.auth.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;

/**
 * 登录响应DTO
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Schema(description = "登录响应")
public class LoginResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户信息
     */
    @Schema(description = "用户信息")
    private User user;

    /**
     * 访问令牌
     */
    @Schema(description = "访问令牌", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    /**
     * 令牌类型
     */
    @Schema(description = "令牌类型", example = "Bearer")
    private String tokenType;

    /**
     * 令牌过期时间（秒）
     */
    @Schema(description = "令牌过期时间", example = "86400")
    private Long expiresIn;

    public LoginResponse() {
        this.tokenType = "Bearer";
    }

    public LoginResponse(User user, String token, Long expiresIn) {
        this();
        this.user = user;
        this.token = token;
        this.expiresIn = expiresIn;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "user=" + user +
                ", token='" + token + '\'' +
                ", tokenType='" + tokenType + '\'' +
                ", expiresIn=" + expiresIn +
                '}';
    }
}