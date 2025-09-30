package com.flashcast.repository;

import com.flashcast.convert.SubTaskConverter;
import com.flashcast.dto.SubTask;
import com.flashcast.entity.SubTaskDO;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface SubTaskRepository extends IService<SubTaskDO> {
    SubTaskConverter C = Mappers.getMapper(SubTaskConverter.class);

    void revokeInvalidStates(List<Long> runningTaskIds, List<TaskType> types);

    List<SubTask> scanPendingTasks(int execTaskNum);

    List<SubTask> getSubTaskByMainIds(List<Long> taskIds);

    void updateSuccess(Long id, String content);

    void updateStatus(Long id, TaskStatus taskStatus);

    SubTask getLastPending(Long preId);

    List<SubTask> find(List<Long> ids);

    void add(SubTask subTask);

    SubTask getNext(Long taskId);

    void updateStatusAll(Long mainTaskId, TaskStatus taskStatus);
}
