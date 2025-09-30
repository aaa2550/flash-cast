package com.flashcast.entity;

import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_task")
public class TaskDO {

    @Id
    private Long id;
    private TaskType type;
    private String json;
    private Long userId;
    private TaskStatus status;
    private Integer progress;
    private Long resultResourceId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}