package com.flashcast.repository.impl;

import com.flashcast.dto.User;
import com.flashcast.entity.TaskDO;
import com.flashcast.entity.TemplateDO;
import com.flashcast.entity.UserDO;
import com.flashcast.enums.FlagEnum;
import com.flashcast.mapper.UserMapper;
import com.flashcast.repository.UserRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class UserRepositoryImpl extends ServiceImpl<UserMapper, UserDO> implements UserRepository {

    @Override
    public User getByPhone(String phone) {
        return C.convertToDTO(queryChain().eq(UserDO::getPhone, phone)
                .eq(UserDO::getDeleted, FlagEnum.NO.ordinal())
                .one());
    }

    @Override
    public void save(User user) {
        UserDO userDO = C.convertToDO(user);
        save(userDO);
        user.setId(userDO.getId());
    }

    @Override
    public void updateDouyinUserInfo(Long userId, String douyinUserInfo) {
        updateChain().eq(UserDO::getId, userId)
                .set(UserDO::getDouyinUserInfo, douyinUserInfo)
                .set(UserDO::getUpdateTime, new Date())
                .update();
    }

    @Override
    public User get(Long userId) {
        return C.convertToDTO(getById(userId));
    }
}
