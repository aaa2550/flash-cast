package com.flashcast.common.exception;

import com.flashcast.common.response.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import java.util.Set;

/**
 * 全局异常处理器
 * 统一处理系统中的各种异常，返回标准化的错误响应
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理业务异常
     * 
     * @param e 业务异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBusinessException(BusinessException e, HttpServletRequest request) {
        logger.warn("业务异常：{}，请求路径：{}", e.getMessage(), request.getRequestURI());
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理参数校验异常（@RequestBody）
     * 
     * @param e 参数校验异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e, HttpServletRequest request) {
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        StringBuilder errorMessage = new StringBuilder("参数校验失败：");
        
        for (int i = 0; i < fieldErrors.size(); i++) {
            FieldError fieldError = fieldErrors.get(i);
            errorMessage.append(fieldError.getField())
                      .append(" ")
                      .append(fieldError.getDefaultMessage());
            
            if (i < fieldErrors.size() - 1) {
                errorMessage.append("；");
            }
        }
        
        logger.warn("参数校验异常：{}，请求路径：{}", errorMessage.toString(), request.getRequestURI());
        return Result.error(400, errorMessage.toString());
    }

    /**
     * 处理参数绑定异常（@ModelAttribute）
     * 
     * @param e 参数绑定异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleBindException(BindException e, HttpServletRequest request) {
        List<FieldError> fieldErrors = e.getFieldErrors();
        StringBuilder errorMessage = new StringBuilder("参数绑定失败：");
        
        for (int i = 0; i < fieldErrors.size(); i++) {
            FieldError fieldError = fieldErrors.get(i);
            errorMessage.append(fieldError.getField())
                      .append(" ")
                      .append(fieldError.getDefaultMessage());
            
            if (i < fieldErrors.size() - 1) {
                errorMessage.append("；");
            }
        }
        
        logger.warn("参数绑定异常：{}，请求路径：{}", errorMessage.toString(), request.getRequestURI());
        return Result.error(400, errorMessage.toString());
    }

    /**
     * 处理约束违反异常（@RequestParam）
     * 
     * @param e 约束违反异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e, HttpServletRequest request) {
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        StringBuilder errorMessage = new StringBuilder("参数约束违反：");
        
        int count = 0;
        for (ConstraintViolation<?> violation : violations) {
            errorMessage.append(violation.getPropertyPath())
                      .append(" ")
                      .append(violation.getMessage());
            
            if (++count < violations.size()) {
                errorMessage.append("；");
            }
        }
        
        logger.warn("约束违反异常：{}，请求路径：{}", errorMessage.toString(), request.getRequestURI());
        return Result.error(400, errorMessage.toString());
    }

    /**
     * 处理非法参数异常
     * 
     * @param e 非法参数异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<Void> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
        logger.warn("非法参数异常：{}，请求路径：{}", e.getMessage(), request.getRequestURI());
        return Result.error(400, "参数错误：" + e.getMessage());
    }

    /**
     * 处理空指针异常
     * 
     * @param e 空指针异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleNullPointerException(NullPointerException e, HttpServletRequest request) {
        logger.error("空指针异常，请求路径：{}", request.getRequestURI(), e);
        return Result.error(500, "系统内部错误");
    }

    /**
     * 处理其他未知异常
     * 
     * @param e 异常
     * @param request HTTP请求
     * @return 错误响应
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception e, HttpServletRequest request) {
        logger.error("系统异常，请求路径：{}", request.getRequestURI(), e);
        return Result.error(500, "系统内部错误");
    }
}