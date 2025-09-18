package com.flashcast.common;

/**
 * 响应状态码枚举类
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
public enum ResultCode {

    /**
     * 成功
     */
    SUCCESS(200, "操作成功"),

    /**
     * 客户端错误
     */
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "拒绝访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),
    CONFLICT(409, "数据冲突"),
    VALIDATION_ERROR(422, "参数验证失败"),

    /**
     * 服务器错误
     */
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    BAD_GATEWAY(502, "网关错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),

    /**
     * 业务错误 (6000-6999)
     */
    // 用户相关错误
    USER_NOT_FOUND(6001, "用户不存在"),
    USER_ALREADY_EXISTS(6002, "用户已存在"),
    INVALID_PHONE_NUMBER(6003, "手机号格式错误"),
    INVALID_VERIFY_CODE(6004, "验证码错误"),
    VERIFY_CODE_EXPIRED(6005, "验证码已过期"),
    VERIFY_CODE_SEND_FAILED(6006, "验证码发送失败"),
    VERIFY_CODE_SEND_TOO_FREQUENT(6007, "验证码发送过于频繁"),
    PASSWORD_ERROR(6008, "密码错误"),
    TOKEN_INVALID(6009, "令牌无效"),
    TOKEN_EXPIRED(6010, "令牌已过期"),

    // 文件相关错误
    FILE_UPLOAD_FAILED(6101, "文件上传失败"),
    FILE_NOT_FOUND(6102, "文件不存在"),
    FILE_TYPE_NOT_SUPPORTED(6103, "文件类型不支持"),
    FILE_SIZE_EXCEEDED(6104, "文件大小超出限制"),

    // 视频相关错误
    VIDEO_GENERATION_FAILED(6201, "视频生成失败"),
    VIDEO_PROCESSING(6202, "视频正在处理中"),
    VIDEO_NOT_FOUND(6203, "视频不存在"),

    // 系统配置错误
    CONFIG_ERROR(6901, "系统配置错误"),
    THIRD_PARTY_SERVICE_ERROR(6902, "第三方服务错误");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    /**
     * 根据状态码获取枚举值
     * 
     * @param code 状态码
     * @return 对应的枚举值，如果不存在则返回null
     */
    public static ResultCode getByCode(Integer code) {
        for (ResultCode resultCode : values()) {
            if (resultCode.getCode().equals(code)) {
                return resultCode;
            }
        }
        return null;
    }
}