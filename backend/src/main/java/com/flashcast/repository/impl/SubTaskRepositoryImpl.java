package com.flashcast.repository.impl;

import com.flashcast.dto.SubTask;
import com.flashcast.entity.SubTaskDO;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.flashcast.mapper.SubTaskMapper;
import com.flashcast.repository.SubTaskRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@Repository
public class SubTaskRepositoryImpl extends ServiceImpl<SubTaskMapper, SubTaskDO> implements SubTaskRepository {

    @Override
    public void revokeInvalidStates(List<Long> runningTaskIds, List<TaskType> types) {
        if (CollectionUtils.isEmpty(runningTaskIds)) {
            updateChain().in(SubTaskDO::getType, types)
                    .set(SubTaskDO::getStatus, TaskStatus.PENDING)
                    .set(SubTaskDO::getUpdateTime, new Date())
                    .update();
            return;
        }
        updateChain().notIn(SubTaskDO::getId, runningTaskIds)
                .in(SubTaskDO::getType, types)
                .set(SubTaskDO::getStatus, TaskStatus.PENDING)
                .set(SubTaskDO::getUpdateTime, new Date())
                .update();
    }

    @Override
    public List<SubTask> scanPendingTasks(int execTaskNum) {
        return C.convertToDTO(queryChain().eq(SubTaskDO::getStatus, TaskStatus.PENDING)
                .orderBy(SubTaskDO::getId, false)
                .list());
    }

    @Override
    public List<SubTask> getSubTaskByMainIds(List<Long> taskIds) {
        if (CollectionUtils.isEmpty(taskIds)) {
            return Collections.emptyList();
        }
        return C.convertToDTO(queryChain().in(SubTaskDO::getMainTaskId, taskIds).list());
    }

    @Override
    public void updateSuccess(Long id, String content) {
        updateChain().eq(SubTaskDO::getId, id)
                .set(SubTaskDO::getStatus, TaskStatus.SUCCESS)
                .set(SubTaskDO::getContent, content)
                .update();
    }

    @Override
    public void updateStatus(Long id, TaskStatus taskStatus) {
        updateChain().eq(SubTaskDO::getId, id)
                .set(SubTaskDO::getStatus, taskStatus)
                .update();
    }

    @Override
    public SubTask getLastPending(Long preId) {
        return C.convertToDTO(queryChain().eq(SubTaskDO::getStatus, TaskStatus.PENDING)
                .lt(SubTaskDO::getId, preId)
                .orderBy(SubTaskDO::getId, false)
                .one());
    }

    @Override
    public List<SubTask> find(List<Long> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return Collections.emptyList();
        }
        return C.convertToDTO(queryChain().in(SubTaskDO::getId, ids).list());
    }

    @Override
    public void add(SubTask subTask) {
        SubTaskDO subTaskDO = C.convertToDO(subTask);
        save(subTaskDO);
        subTask.setId(subTaskDO.getId());
    }
}
