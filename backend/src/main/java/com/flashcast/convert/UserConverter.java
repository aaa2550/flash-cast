package com.flashcast.convert;

import com.flashcast.dto.CustomUser;
import com.flashcast.dto.User;
import com.flashcast.entity.UserDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UserConverter {

    UserConverter C = Mappers.getMapper(UserConverter.class);

    User convertToDTO(UserDO obj);

    List<User> convertToDTO(List<UserDO> list);

    Page<User> convertToDTO(Page<UserDO> page);

    UserDO convertToDO(User obj);

    List<UserDO> convertToDO(List<User> list);

    CustomUser convertToCustomUser(User obj);
}
