package com.flashcast.convert;

import com.flashcast.dto.SubTask;
import com.flashcast.entity.SubTaskDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface SubTaskConverter {

    SubTaskConverter C = Mappers.getMapper(SubTaskConverter.class);

    SubTask convertToDTO(SubTaskDO obj);

    List<SubTask> convertToDTO(List<SubTaskDO> list);

    Page<SubTask> convertToDTO(Page<SubTaskDO> page);

    SubTaskDO convertToDO(SubTask obj);

    List<SubTaskDO> convertToDO(List<SubTask> list);
}
