package com.flashcast.convert;

import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface TaskConverter {

    TaskConverter C = Mappers.getMapper(TaskConverter.class);

    Task convertToDTO(TaskDO obj);

    List<Task> convertToDTO(List<TaskDO> list);

    Page<Task> convertToDTO(Page<TaskDO> page);

    TaskDO convertToDO(Task obj);

    List<TaskDO> convertToDO(List<Task> list);

    default List<Long> toIds(List<Task> list) {
        return list.stream().map(Task::getId).toList();
    }
}
