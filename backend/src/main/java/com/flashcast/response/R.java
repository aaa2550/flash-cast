package com.flashcast.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 统一API响应结果类
 *
 * @param <T> 响应数据类型
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Data
@Schema(description = "统一响应结果")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class R<T> {

    /**
     * 响应状态码
     */
    @Schema(description = "响应状态码", example = "0")
    private Integer code;

    /**
     * 响应消息
     */
    @Schema(description = "响应消息", example = "操作成功")
    private String message;

    /**
     * 响应数据
     */
    @Schema(description = "响应数据")
    private T data;

    /**
     * 时间戳
     */
    @Schema(description = "时间戳", example = "1672531200000")
    private Long timestamp;

    public R() {
        this.timestamp = System.currentTimeMillis();
    }

    public R(Integer code, String message) {
        this();
        this.code = code;
        this.message = message;
    }

    public R(Integer code, String message, T data) {
        this(code, message);
        this.data = data;
    }

    /**
     * 成功响应
     */
    public static <T> R<T> success() {
        return new R<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage());
    }

    /**
     * 成功响应，带数据
     */
    public static <T> R<T> success(T data) {
        return new R<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    /**
     * 成功响应，自定义消息
     */
    public static <T> R<T> success(String message) {
        return new R<>(ResultCode.SUCCESS.getCode(), message);
    }

    /**
     * 成功响应，自定义消息和数据
     */
    public static <T> R<T> success(String message, T data) {
        return new R<>(ResultCode.SUCCESS.getCode(), message, data);
    }

    /**
     * 失败响应
     */
    public static <T> R<T> error() {
        return new R<>(ResultCode.INTERNAL_SERVER_ERROR.getCode(), ResultCode.INTERNAL_SERVER_ERROR.getMessage());
    }

    /**
     * 失败响应，自定义消息
     */
    public static <T> R<T> error(String message) {
        return new R<>(ResultCode.INTERNAL_SERVER_ERROR.getCode(), message);
    }

    /**
     * 失败响应，自定义状态码和消息
     */
    public static <T> R<T> error(Integer code, String message) {
        return new R<>(code, message);
    }

    /**
     * 失败响应，使用结果码枚举
     */
    public static <T> R<T> error(ResultCode resultCode) {
        return new R<>(resultCode.getCode(), resultCode.getMessage());
    }

    /**
     * 失败响应，使用结果码枚举和数据
     */
    public static <T> R<T> error(ResultCode resultCode, T data) {
        return new R<>(resultCode.getCode(), resultCode.getMessage(), data);
    }

    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", timestamp=" + timestamp +
                '}';
    }
}