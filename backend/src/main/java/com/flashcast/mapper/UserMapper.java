package com.flashcast.mapper;

import com.flashcast.entity.UserDO;
import com.mybatisflex.core.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户数据访问层
 *
 * @author Flash Cast Team
 * @version 1.0.0
 * @since 2025-09-18
 */
@Mapper
public interface UserMapper extends BaseMapper<UserDO> {

}