package com.flashcast.common.exception;

/**
 * 业务异常类
 * 用于表示业务逻辑中的异常情况
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
public class BusinessException extends RuntimeException {

    /**
     * 错误码
     */
    private int code;

    /**
     * 默认构造函数
     */
    public BusinessException() {
        super();
        this.code = 500;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     */
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    /**
     * 构造函数
     * 
     * @param code 错误码
     * @param message 错误消息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    /**
     * 构造函数
     * 
     * @param message 错误消息
     * @param cause 原因
     */
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.code = 500;
    }

    /**
     * 构造函数
     * 
     * @param code 错误码
     * @param message 错误消息
     * @param cause 原因
     */
    public BusinessException(int code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    /**
     * 获取错误码
     * 
     * @return 错误码
     */
    public int getCode() {
        return code;
    }

    /**
     * 设置错误码
     * 
     * @param code 错误码
     */
    public void setCode(int code) {
        this.code = code;
    }
}