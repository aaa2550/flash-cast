package com.flashcast.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class LocalCacheService {

    // 验证码缓存：key为手机号，value为验证码
    // 配置过期时间为5分钟，最大缓存10000条记录
    private final Cache<String, String> codeCache = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES) // 写入后5分钟过期
            .maximumSize(10000) // 最大缓存数量
            .concurrencyLevel(Runtime.getRuntime().availableProcessors()) // 并发级别，根据CPU核心数设置
            .recordStats() // 开启统计功能，可选
            .build();

    /**
     * 存储验证码
     * @param mobile 手机号
     * @param code 验证码
     * @param expireSeconds 过期时间(秒)
     */
    public void setCode(String mobile, String code, int expireSeconds) {
        codeCache.put(mobile, code);
        // 如果需要自定义过期时间，可以使用下面的方式
        // codeCache.put(mobile, code, expireSeconds, TimeUnit.SECONDS);
    }

    /**
     * 获取验证码
     * @param mobile 手机号
     * @return 验证码，如果不存在或已过期则返回null
     */
    public String getCode(String mobile) {
        return codeCache.getIfPresent(mobile);
    }

    /**
     * 移除验证码（验证成功后调用，防止重复使用）
     * @param mobile 手机号
     */
    public void removeCode(String mobile) {
        codeCache.invalidate(mobile);
    }

    /**
     * 检查验证码是否存在
     * @param mobile 手机号
     * @return 是否存在
     */
    public boolean hasCode(String mobile) {
        return getCode(mobile) != null;
    }

    public void sendVerifyCode(String phone) {
        String code = String.format("%06d", new Random().nextInt(999999));
        // 2. 存储验证码，有效期5分钟
        setCode(phone, code, 300);

    }
}
