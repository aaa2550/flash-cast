package com.flashcast.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 * 注册请求DTO
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Schema(description = "注册请求")
public class RegisterRequest implements Serializable {

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

    /**
     * 用户昵称
     */
    @Schema(description = "用户昵称", example = "用户8888", required = true)
    @NotBlank(message = "昵称不能为空")
    @Size(min = 1, max = 20, message = "昵称长度必须在1-20字符之间")
    private String nickname;

    public RegisterRequest() {
    }

    public RegisterRequest(String phone, String verifyCode, String nickname) {
        this.phone = phone;
        this.verifyCode = verifyCode;
        this.nickname = nickname;
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

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "phone='" + phone + '\'' +
                ", verifyCode='" + verifyCode + '\'' +
                ", nickname='" + nickname + '\'' +
                '}';
    }
}