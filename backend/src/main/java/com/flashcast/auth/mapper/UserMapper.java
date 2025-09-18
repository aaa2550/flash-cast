package com.flashcast.auth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.flashcast.auth.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;

/**
 * 用户数据访问层
 * 
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据手机号查询用户
     * 
     * @param phone 手机号
     * @return 用户信息，如果不存在则返回null
     */
    @Select("SELECT * FROM fc_user WHERE phone = #{phone} AND deleted = 0")
    User selectByPhone(@Param("phone") String phone);

    /**
     * 更新用户最后登录时间
     * 
     * @param userId 用户ID
     * @param lastLoginTime 最后登录时间
     * @return 影响的行数
     */
    @Select("UPDATE fc_user SET last_login_time = #{lastLoginTime} WHERE id = #{userId}")
    int updateLastLoginTime(@Param("userId") Long userId, @Param("lastLoginTime") LocalDateTime lastLoginTime);
}