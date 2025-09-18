package com.flashcast.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.io.Serializable;

/**
 * 发送验证码请求DTO
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Schema(description = "发送验证码请求")
public class SendCodeRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 手机号
     */
    @Schema(description = "手机号", example = "13888888888", required = true)
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式错误")
    private String phone;

    public SendCodeRequest() {
    }

    public SendCodeRequest(String phone) {
        this.phone = phone;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "SendCodeRequest{" +
                "phone='" + phone + '\'' +
                '}';
    }
}