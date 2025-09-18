package com.flashcast;

// import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Flash Cast 应用程序主启动类
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@SpringBootApplication
// @MapperScan("com.flashcast.**.mapper")
@EnableAspectJAutoProxy
@EnableAsync
public class FlashCastApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlashCastApplication.class, args);
    }
}