package com.flashcast.repository;

import com.flashcast.convert.ResourceConverter;
import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.flashcast.enums.ResourceType;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface ResourceRepository extends IService<ResourceDO> {
    ResourceConverter C = Mappers.getMapper(ResourceConverter.class);
    void add(Resource resource);

    List<Resource> find(Long userId, ResourceType resourceType, Integer page, Integer pageSize);

    List<Resource> find(List<Long> ids);

    Resource get(Long id);

    void delete(Long id);
}
