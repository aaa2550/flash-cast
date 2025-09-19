package com.flashcast.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    /**
     * 自动注册用户
     * @param mobile 手机号
     * @return 注册后的用户信息
     */
    UserDetails autoRegister(String mobile);
}
