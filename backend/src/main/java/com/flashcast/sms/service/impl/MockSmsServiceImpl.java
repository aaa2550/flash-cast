package com.flashcast.sms.service.impl;

import com.flashcast.sms.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Mock短信服务实现类
 * 用于开发环境测试，不发送真实短信
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Service
public class MockSmsServiceImpl implements SmsService {

    private static final Logger logger = LoggerFactory.getLogger(MockSmsServiceImpl.class);

    @Override
    public boolean sendVerifyCode(String phone, String code) {
        logger.info("Mock发送验证码 - 手机号：{}，验证码：{}", phone, code);
        // 模拟发送成功
        return true;
    }

    @Override
    public boolean sendNotificationSms(String phone, String content) {
        logger.info("Mock发送通知短信 - 手机号：{}，内容：{}", phone, content);
        // 模拟发送成功
        return true;
    }

    @Override
    public boolean sendTemplateSms(String phone, String templateCode, String templateParams) {
        logger.info("Mock发送模板短信 - 手机号：{}，模板代码：{}，参数：{}", phone, templateCode, templateParams);
        // 模拟发送成功
        return true;
    }
}