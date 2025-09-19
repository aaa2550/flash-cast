package com.flashcast.repository.impl;

import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.flashcast.mapper.ResourceMapper;
import com.flashcast.repository.ResourceRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

@Repository
public class ResourceRepositoryImpl extends ServiceImpl<ResourceMapper, ResourceDO> implements ResourceRepository {

    @Override
    public void add(Resource resource) {
        ResourceDO taskDO = INSTANCE.convertToDO(resource);
        save(taskDO);
        taskDO.setId(resource.getId());
    }
}
