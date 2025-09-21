package com.flashcast.dto;

import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import lombok.Data;

import java.util.Date;

@Data
public class SubTask {
    private Long id;
    private Long mainTaskId;
    private SubTaskType type;
    private String json;
    private String content;
    private String dependOnIds;
    private TaskStatus status;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;
}
