package com.flashcast.auth.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT工具类
 * 负责JWT令牌的生成、验证和解析
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    /**
     * JWT签名密钥
     */
    @Value("${flashcast.jwt.secret}")
    private String secret;

    /**
     * JWT过期时间（毫秒）
     */
    @Value("${flashcast.jwt.expiration}")
    private Long expiration;

    /**
     * JWT发行者
     */
    @Value("${flashcast.jwt.issuer}")
    private String issuer;

    /**
     * 生成JWT令牌
     * 
     * @param userId 用户ID
     * @param phone 用户手机号
     * @return JWT令牌字符串
     */
    public String generateToken(Long userId, String phone) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + expiration);

            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(userId.toString())
                    .withClaim("phone", phone)
                    .withClaim("userId", userId)
                    .withIssuedAt(now)
                    .withExpiresAt(expiryDate)
                    .sign(algorithm);

        } catch (JWTCreationException e) {
            logger.error("创建JWT令牌失败，用户ID：{}，手机号：{}", userId, phone, e);
            return null;
        }
    }

    /**
     * 验证JWT令牌
     * 
     * @param token JWT令牌
     * @return 验证是否成功
     */
    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build();
            
            verifier.verify(token);
            return true;

        } catch (JWTVerificationException e) {
            logger.warn("JWT令牌验证失败：{}", e.getMessage());
            return false;
        }
    }

    /**
     * 从JWT令牌中解析用户ID
     * 
     * @param token JWT令牌
     * @return 用户ID，解析失败返回null
     */
    public Long getUserIdFromToken(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT != null) {
                return decodedJWT.getClaim("userId").asLong();
            }
        } catch (Exception e) {
            logger.warn("从JWT令牌解析用户ID失败", e);
        }
        return null;
    }

    /**
     * 从JWT令牌中解析用户手机号
     * 
     * @param token JWT令牌
     * @return 用户手机号，解析失败返回null
     */
    public String getPhoneFromToken(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT != null) {
                return decodedJWT.getClaim("phone").asString();
            }
        } catch (Exception e) {
            logger.warn("从JWT令牌解析手机号失败", e);
        }
        return null;
    }

    /**
     * 检查JWT令牌是否过期
     * 
     * @param token JWT令牌
     * @return 是否过期，true表示已过期
     */
    public boolean isTokenExpired(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT != null) {
                Date expiresAt = decodedJWT.getExpiresAt();
                return expiresAt != null && expiresAt.before(new Date());
            }
        } catch (Exception e) {
            logger.warn("检查JWT令牌过期时间失败", e);
        }
        return true; // 解析失败默认认为已过期
    }

    /**
     * 解码JWT令牌
     * 
     * @param token JWT令牌
     * @return 解码后的JWT对象
     */
    private DecodedJWT decodeToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build();
            
            return verifier.verify(token);

        } catch (JWTVerificationException e) {
            logger.warn("JWT令牌解码失败：{}", e.getMessage());
            return null;
        }
    }

    /**
     * 获取JWT令牌的剩余有效时间（秒）
     * 
     * @param token JWT令牌
     * @return 剩余有效时间（秒），-1表示获取失败或已过期
     */
    public long getTokenRemainingTime(String token) {
        try {
            DecodedJWT decodedJWT = decodeToken(token);
            if (decodedJWT != null) {
                Date expiresAt = decodedJWT.getExpiresAt();
                if (expiresAt != null) {
                    long remainingTime = (expiresAt.getTime() - System.currentTimeMillis()) / 1000;
                    return Math.max(0, remainingTime);
                }
            }
        } catch (Exception e) {
            logger.warn("获取JWT令牌剩余时间失败", e);
        }
        return -1;
    }
}