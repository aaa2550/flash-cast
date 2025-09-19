package com.flashcast.security;

import com.flashcast.service.LocalCacheService;
import com.flashcast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MobilePhoneAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserService userService;
    @Autowired
    private LocalCacheService localCacheService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        MobilePhoneAuthenticationToken authenticationToken = (MobilePhoneAuthenticationToken) authentication;
        String mobile = (String) authenticationToken.getPrincipal();
        String code = (String) authenticationToken.getCredentials();

        // 1. 验证验证码
        String cachedCode = localCacheService.getCode(mobile);
        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new BadCredentialsException("验证码错误或已过期");
        }

        // 2. 验证用户是否存在，不存在则自动注册
        UserDetails userDetails;
        try {
            userDetails = userService.loadUserByUsername(mobile);
        } catch (UsernameNotFoundException e) {
            // 自动注册用户
            userDetails = userService.autoRegister(mobile);
        }

        // 3. 验证通过，清除验证码
        localCacheService.removeCode(mobile);

        // 4. 返回认证成功的Token
        MobilePhoneAuthenticationToken result = new MobilePhoneAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        result.setDetails(authenticationToken.getDetails());
        return result;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return MobilePhoneAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
