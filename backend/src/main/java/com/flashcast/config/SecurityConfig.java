package com.flashcast.config;

import com.flashcast.filter.PhoneAuthenticationFilter;
import com.flashcast.security.AuthenticationAccessDeniedHandler;
import com.flashcast.security.FormLoginFailedHandler;
import com.flashcast.security.FormLoginSuccessHandler;
import com.flashcast.security.PhoneAuthenticationProvider;
import com.flashcast.service.LocalCacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private LocalCacheService localCacheService;
    @Autowired
    private FormLoginSuccessHandler successHandler;
    @Autowired
    private FormLoginFailedHandler failureHandler;
    @Autowired
    private AuthenticationAccessDeniedHandler accessDeniedHandler;
    @Autowired
    private PhoneAuthenticationProvider phoneAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 创建手机验证码过滤器
        PhoneAuthenticationFilter phoneFilter = new PhoneAuthenticationFilter("/phone/login");
        phoneFilter.setAuthenticationManager(authenticationManager());
        phoneFilter.setAuthenticationSuccessHandler(successHandler);
        phoneFilter.setAuthenticationFailureHandler(failureHandler);

        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/sendCode", "/auth/send-verify-code", "/user/reg", "/sendLoginVerifyCode", "/phone/login").permitAll()
                        .requestMatchers("/doc.html").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("http://localhost:3000/#/login")
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                        .loginProcessingUrl("/user/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .permitAll()
                )
                .logout(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex.accessDeniedHandler(accessDeniedHandler))
                .addFilterAfter(phoneFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(phoneAuthenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
