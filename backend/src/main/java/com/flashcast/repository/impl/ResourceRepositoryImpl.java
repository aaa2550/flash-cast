package com.flashcast.repository.impl;

import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.flashcast.entity.TaskDO;
import com.flashcast.enums.FlagEnum;
import com.flashcast.enums.ResourceType;
import com.flashcast.mapper.ResourceMapper;
import com.flashcast.repository.ResourceRepository;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class ResourceRepositoryImpl extends ServiceImpl<ResourceMapper, ResourceDO> implements ResourceRepository {

    @Override
    public void add(Resource resource) {
        ResourceDO resourceDO = C.convertToDO(resource);
        save(resourceDO);
        resource.setId(resourceDO.getId());
    }

    @Override
    public List<Resource> find(Long userId, ResourceType resourceType, Integer page, Integer pageSize) {
        return C.convertToDTO(queryChain().eq(ResourceDO::getType, resourceType)
                .eq(ResourceDO::getUserId, userId)
                        .eq(ResourceDO::getDeleted, FlagEnum.NO.ordinal())
                .page(Page.of(page, pageSize)).getRecords());
    }

    @Override
    public List<Resource> find(List<Long> ids) {
        return C.convertToDTO(queryChain().in(ResourceDO::getId, ids).eq(ResourceDO::getDeleted, FlagEnum.NO.ordinal()).list());
    }

    @Override
    public Resource get(Long id) {
        return C.convertToDTO(queryChain().eq(ResourceDO::getId, id).eq(ResourceDO::getDeleted, FlagEnum.NO.ordinal()).one());
    }

    @Override
    public void delete(Long id) {
        updateChain().eq(ResourceDO::getId, id)
                .set(ResourceDO::getDeleted, FlagEnum.YES.ordinal())
                .set(ResourceDO::getUpdateTime, new Date())
                .update();
    }

    @Override
    public List<Resource> findByTaskId(Long taskId) {
        return C.convertToDTO(queryChain().eq(TaskDO::getId, taskId).list());
    }
}
