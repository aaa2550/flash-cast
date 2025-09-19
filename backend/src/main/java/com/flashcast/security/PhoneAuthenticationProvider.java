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
public class PhoneAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserService userService;
    @Autowired
    private LocalCacheService localCacheService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        PhoneAuthenticationToken authenticationToken = (PhoneAuthenticationToken) authentication;
        String phone = (String) authenticationToken.getPrincipal();
        String code = (String) authenticationToken.getCredentials();

        // 1. 验证验证码
        String cachedCode = localCacheService.getCode(phone);
        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new BadCredentialsException("验证码错误或已过期");
        }

        // 2. 验证用户是否存在，不存在则自动注册
        UserDetails userDetails = userService.loadUserByUsername(phone);

        // 3. 验证通过，清除验证码
        localCacheService.removeCode(phone);

        // 4. 返回认证成功的Token
        PhoneAuthenticationToken result = new PhoneAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        result.setDetails(authenticationToken.getDetails());
        return result;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return PhoneAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
