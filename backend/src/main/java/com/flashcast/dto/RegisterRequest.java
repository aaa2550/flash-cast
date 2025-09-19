package com.flashcast.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
@Schema(description = "注册请求")
public class RegisterRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "手机号", requiredMode = Schema.RequiredMode.REQUIRED, example = "13888888888")
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\\\d{9}$", message = "手机号格式错误")
    private String phone;

    @Schema(description = "验证码", requiredMode = Schema.RequiredMode.REQUIRED, example = "123456")
    @NotBlank(message = "验证码不能为空")
    @Size(min = 6, max = 6, message = "验证码必须为6位")
    @Pattern(regexp = "^\\\\d{6}$", message = "验证码必须为6位数字")
    private String verifyCode;

    @Schema(description = "用户昵称", requiredMode = Schema.RequiredMode.REQUIRED, example = "用户8888")
    @NotBlank(message = "昵称不能为空")
    @Size(min = 1, max = 20, message = "昵称长度必须在1-20字符之间")
    private String nickname;
}