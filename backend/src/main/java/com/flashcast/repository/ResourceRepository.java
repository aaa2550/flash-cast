package com.flashcast.repository;

import com.flashcast.convert.ResourceConverter;
import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

public interface ResourceRepository extends IService<ResourceDO> {
    ResourceConverter INSTANCE = Mappers.getMapper(ResourceConverter.class);
    void add(Resource task);
}
