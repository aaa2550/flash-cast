package com.flashcast.service.impl;

import com.flashcast.dto.User;
import com.flashcast.repository.UserRepository;
import com.flashcast.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        User user = userRepository.getByPhone(mobile);

        // 构建并返回UserDetails对象
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getPhone())
                .password(user.getPassword())
                .build();
    }

    @Override
    public UserDetails autoRegister(String mobile) {
        // 1. 创建新用户
        User user = new User();
        user.setPhone(mobile);
        // 设置默认密码（实际项目可使用随机密码或加密的手机号）
        user.setPassword(passwordEncoder.encode("123456"));
        user.setNickname("用户_" + mobile.substring(mobile.length() - 4)); // 生成默认昵称

        // 2. 保存用户到数据库
        userRepository.save(user);

        // 3. 返回UserDetails对象
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getPhone())
                .password(user.getPassword())
                .build();
    }
}
