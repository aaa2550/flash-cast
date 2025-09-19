package com.flashcast.service.impl;

import com.flashcast.dto.User;
import com.flashcast.repository.UserRepository;
import com.flashcast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        User user = getAutoRegisterUser(phone);
        // 构建并返回UserDetails对象
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getPhone())
                .password(passwordEncoder.encode(user.getPhone()))
                .build();
    }

    private User getAutoRegisterUser(String phone) {
        User user = getUser(phone);
        if (user == null) {
            user = autoRegister(phone);
        }
        return user;
    }

    @Override
    public User getUser(String phone) {
        return userRepository.getByPhone(phone);
    }

    @Override
    public User autoRegister(String phone) {
        // 1. 创建新用户
        User user = new User();
        user.setPhone(phone);
        // 设置默认密码（实际项目可使用随机密码或加密的手机号）
        user.setPassword(passwordEncoder.encode("123456"));
        user.setNickname("用户_" + phone.substring(phone.length() - 4)); // 生成默认昵称

        // 2. 保存用户到数据库
        userRepository.save(user);

        return user;
    }
}
