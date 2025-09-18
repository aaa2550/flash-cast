package com.flashcast.auth.service.impl;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.flashcast.auth.dto.LoginRequest;
import com.flashcast.auth.dto.LoginResponse;
import com.flashcast.auth.dto.RegisterRequest;
import com.flashcast.auth.dto.SendCodeRequest;
import com.flashcast.auth.entity.User;
// import com.flashcast.auth.mapper.UserMapper;
import com.flashcast.auth.service.AuthService;
import com.flashcast.common.ResultCode;
import com.flashcast.exception.BusinessException;
import com.flashcast.sms.service.SmsService;
import com.flashcast.auth.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * 用户认证服务实现类
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    /**
     * 验证码缓存key前缀
     */
    private static final String VERIFY_CODE_KEY = "verify:code:";

    /**
     * 验证码发送频率限制key前缀
     */
    private static final String VERIFY_CODE_LIMIT_KEY = "verify:limit:";

    /**
     * 验证码长度
     */
    private static final int VERIFY_CODE_LENGTH = 6;

    /**
     * 验证码过期时间（秒）
     */
    private static final int VERIFY_CODE_EXPIRE = 300;

    /**
     * 验证码发送间隔时间（秒）
     */
    private static final int VERIFY_CODE_INTERVAL = 60;

    // @Autowired
    // private UserMapper userMapper;

    @Autowired
    private SmsService smsService;

    // @Autowired
    // private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * JWT过期时间（毫秒）
     */
    @Value("${flashcast.jwt.expiration}")
    private Long expiration;

    @Override
    public boolean sendVerifyCode(SendCodeRequest request) {
        String phone = request.getPhone();
        
        // 暂时简化：跳过频率限制检查（生产环境需要使用Redis）
        logger.debug("跳过频率限制检查（开发环境）");

        // 生成验证码
        String verifyCode = RandomUtil.randomNumbers(VERIFY_CODE_LENGTH);
        
        try {
            // 发送短信验证码
            boolean sendResult = smsService.sendVerifyCode(phone, verifyCode);
            if (!sendResult) {
                logger.error("短信发送失败，手机号：{}", phone);
                throw new BusinessException(ResultCode.VERIFY_CODE_SEND_FAILED);
            }

            // 暂时简化：直接返回成功（生产环境需要使用Redis缓存验证码）
            logger.info("验证码发送成功，手机号：{}，验证码：{}", phone, verifyCode);
            return true;

        } catch (Exception e) {
            logger.error("发送验证码异常，手机号：{}", phone, e);
            throw new BusinessException(ResultCode.VERIFY_CODE_SEND_FAILED);
        }
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 暂时简化：开发环境直接返回成功
        throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "数据库功能暂未完成");
    }

    @Override
    // @Transactional(rollbackFor = Exception.class)
    public LoginResponse register(RegisterRequest request) {
        // 暂时简化：开发环境直接返回成功
        throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "数据库功能暂未完成");
    }

    @Override
    // @Transactional(rollbackFor = Exception.class)
    public LoginResponse loginOrRegister(LoginRequest request) {
        // 暂时简化：开发环境直接返回成功
        throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "数据库功能暂未完成");
    }

    /**
     * 根据手机号查询用户
     * 
     * @param phone 手机号
     * @return 用户信息
     */
    private User getUserByPhone(String phone) {
        // 暂时简化：返回null
        return null;
        // LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        // queryWrapper.eq(User::getPhone, phone);
        // return userMapper.selectOne(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResponse register(RegisterRequest request) {
        String phone = request.getPhone();
        String verifyCode = request.getVerifyCode();
        String nickname = request.getNickname();

        // 验证验证码
        if (!verifyCode(phone, verifyCode)) {
            throw new BusinessException(ResultCode.INVALID_VERIFY_CODE);
        }

        // 检查用户是否已存在
        User existUser = getUserByPhone(phone);
        if (existUser != null) {
            throw new BusinessException(ResultCode.USER_ALREADY_EXISTS);
        }

        // 创建新用户
        User user = new User(phone, nickname);
        user.setLastLoginTime(LocalDateTime.now());
        
        int insertResult = userMapper.insert(user);
        if (insertResult <= 0) {
            logger.error("用户注册失败，手机号：{}", phone);
            throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "注册失败");
        }

        // 生成JWT令牌
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());

        // 清除验证码
        clearVerifyCode(phone);

        logger.info("用户注册成功，手机号：{}", phone);
        return new LoginResponse(user, token, expiration / 1000); // 转换为秒
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LoginResponse loginOrRegister(LoginRequest request) {
        String phone = request.getPhone();
        String verifyCode = request.getVerifyCode();

        // 验证验证码
        if (!verifyCode(phone, verifyCode)) {
            throw new BusinessException(ResultCode.INVALID_VERIFY_CODE);
        }

        // 查询用户
        User user = getUserByPhone(phone);
        
        if (user != null) {
            // 用户存在，执行登录逻辑
            if (user.getStatus() != 0) {
                throw new BusinessException(ResultCode.FORBIDDEN, "账号已被禁用");
            }

            // 更新最后登录时间
            user.setLastLoginTime(LocalDateTime.now());
            userMapper.updateById(user);

            logger.info("用户登录成功，手机号：{}", phone);
        } else {
            // 用户不存在，执行注册逻辑
            String nickname = "用户" + phone.substring(phone.length() - 4);
            user = new User(phone, nickname);
            user.setLastLoginTime(LocalDateTime.now());
            
            int insertResult = userMapper.insert(user);
            if (insertResult <= 0) {
                logger.error("用户自动注册失败，手机号：{}", phone);
                throw new BusinessException(ResultCode.INTERNAL_SERVER_ERROR, "注册失败");
            }

            logger.info("用户自动注册成功，手机号：{}", phone);
        }

        // 生成JWT令牌
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());

        // 清除验证码
        clearVerifyCode(phone);

        return new LoginResponse(user, token, expiration / 1000); // 转换为秒
    }

    @Override
    public boolean verifyCode(String phone, String verifyCode) {
        if (StrUtil.hasBlank(phone, verifyCode)) {
            return false;
        }

        // 暂时简化：开发环境使用固定验证码 123456
        return "123456".equals(verifyCode);
    }

    /**
     * 清除验证码缓存
     * 
     * @param phone 手机号
     */
    private void clearVerifyCode(String phone) {
        // 暂时简化：跳过清除操作（生产环境需要使用Redis）
        logger.debug("跳过清除验证码操作（开发环境）");
    }
}