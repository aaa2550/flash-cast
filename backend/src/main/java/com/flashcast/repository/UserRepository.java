package com.flashcast.repository;

import com.flashcast.convert.UserConverter;
import com.flashcast.dto.User;
import com.flashcast.entity.UserDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

public interface UserRepository extends IService<UserDO> {
    UserConverter C = Mappers.getMapper(UserConverter.class);

    User getByPhone(String phone);

    void save(User user);
}
