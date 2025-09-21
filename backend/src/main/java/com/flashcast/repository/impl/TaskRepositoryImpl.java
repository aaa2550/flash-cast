package com.flashcast.repository.impl;

import com.flashcast.dto.Task;
import com.flashcast.entity.TaskDO;
import com.flashcast.enums.TaskStatus;
import com.flashcast.mapper.TaskMapper;
import com.flashcast.repository.TaskRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskRepositoryImpl extends ServiceImpl<TaskMapper, TaskDO> implements TaskRepository {

    @Override
    public void add(Task task) {
        TaskDO taskDO = C.convertToDO(task);
        save(taskDO);
        taskDO.setId(task.getId());
    }

    @Override
    public List<Task> find(int execTaskNum) {
        return C.convertToDTO(queryChain().eq(TaskDO::getStatus, TaskStatus.PENDING)
                .orderBy(TaskDO::getId, false)
                .list());
    }

    @Override
    public List<Task> scanRunningTask() {
        return C.convertToDTO(queryChain().eq(TaskDO::getStatus, TaskStatus.RUNNING).list());
    }

    @Override
    public void updateStatus(Long id, TaskStatus taskStatus) {
        updateChain().eq(TaskDO::getId, id).set(TaskDO::getStatus, taskStatus).update();
    }

    @Override
    public void updateProgress(Long id, int progress) {
        updateChain().eq(TaskDO::getId, id).set(TaskDO::getProgress, progress).update();
    }
}
