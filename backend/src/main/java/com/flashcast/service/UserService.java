package com.flashcast.service;

import com.flashcast.dto.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    /**
     * 自动注册用户
     *
     * @param phone 手机号
     * @return 注册后的用户信息
     */
    User autoRegister(String phone);

    User getUser(String phone);
}
