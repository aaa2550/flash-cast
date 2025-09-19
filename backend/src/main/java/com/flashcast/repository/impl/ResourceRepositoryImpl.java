package com.flashcast.repository.impl;

import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.flashcast.enums.ResourceType;
import com.flashcast.mapper.ResourceMapper;
import com.flashcast.repository.ResourceRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ResourceRepositoryImpl extends ServiceImpl<ResourceMapper, ResourceDO> implements ResourceRepository {

    @Override
    public void add(Resource resource) {
        ResourceDO resourceDO = C.convertToDO(resource);
        save(resourceDO);
        resourceDO.setId(resource.getId());
    }

    @Override
    public List<Resource> find(Long userId, ResourceType resourceType) {
        return C.convertToDTO(queryChain().eq(ResourceDO::getType, resourceType)
                .eq(ResourceDO::getUserId, userId)
                .list());
    }

    @Override
    public List<Resource> find(List<Long> ids) {
        return C.convertToDTO(queryChain().in(ResourceDO::getId, ids).list());
    }
}
