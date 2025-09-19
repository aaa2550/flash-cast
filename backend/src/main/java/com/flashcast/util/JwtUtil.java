package com.flashcast.util;

import cn.hutool.extra.spring.SpringUtil;
import com.flashcast.dto.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * JWT工具类
 */
@Component
public class JwtUtil {

    public static String generateToken(User user) {
        String secret = SpringUtil.getProperty("app.jwt.secret");
        Map<String, ?> map = Map.of(
                "id", user.getId(),
                "phone", user.getPhone()
        );

        return Jwts.builder()
                .subject(user.getPhone())
                .issuedAt(new Date())
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .claims(map)
                .compact();
    }

    public static User parseToken(String token) {
        String secret = SpringUtil.getProperty("app.jwt.secret");
        SecretKey signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        Jws<Claims> claimsJws = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);

        Claims claims = claimsJws.getPayload();

        User user = new User();
        user.setId(claims.get("id", Long.class));
        user.setPhone(claims.get("phone", String.class));

        return user;
    }

}