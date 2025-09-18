package com.flashcast.sms.service;

/**
 * 短信服务接口
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
public interface SmsService {

    /**
     * 发送验证码短信
     * 
     * @param phone 手机号
     * @param verifyCode 验证码
     * @return 是否发送成功
     */
    boolean sendVerifyCode(String phone, String verifyCode);

    /**
     * 发送通知短信
     * 
     * @param phone 手机号
     * @param content 短信内容
     * @return 是否发送成功
     */
    boolean sendNotificationSms(String phone, String content);

    /**
     * 发送模板短信
     * 
     * @param phone 手机号
     * @param templateCode 模板代码
     * @param templateParams 模板参数
     * @return 是否发送成功
     */
    boolean sendTemplateSms(String phone, String templateCode, String templateParams);
}