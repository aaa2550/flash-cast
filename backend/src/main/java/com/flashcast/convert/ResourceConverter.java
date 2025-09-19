package com.flashcast.convert;

import com.flashcast.dto.Resource;
import com.flashcast.entity.ResourceDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface ResourceConverter {

    ResourceConverter INSTANCE = Mappers.getMapper(ResourceConverter.class);

    Resource convertToDTO(ResourceDO obj);

    List<Resource> convertToDTO(List<ResourceDO> list);

    Page<Resource> convertToDTO(Page<ResourceDO> page);

    ResourceDO convertToDO(Resource obj);

    List<ResourceDO> convertToDO(List<Resource> list);
}
