package com.flashcast.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 * 登录请求DTO
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Schema(description = "登录请求")
public class LoginRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 手机号
     */
    @Schema(description = "手机号", example = "13888888888", required = true)
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式错误")
    private String phone;

    /**
     * 验证码
     */
    @Schema(description = "验证码", example = "123456", required = true)
    @NotBlank(message = "验证码不能为空")
    @Size(min = 6, max = 6, message = "验证码必须为6位")
    @Pattern(regexp = "^\\d{6}$", message = "验证码必须为6位数字")
    private String verifyCode;

    public LoginRequest() {
    }

    public LoginRequest(String phone, String verifyCode) {
        this.phone = phone;
        this.verifyCode = verifyCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getVerifyCode() {
        return verifyCode;
    }

    public void setVerifyCode(String verifyCode) {
        this.verifyCode = verifyCode;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "phone='" + phone + '\'' +
                ", verifyCode='" + verifyCode + '\'' +
                '}';
    }
}