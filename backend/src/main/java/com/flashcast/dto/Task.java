package com.flashcast.dto;

import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class Task {
    private Long id;
    private TaskType type;
    private String json;
    private Long userId;
    private TaskStatus status;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;
}
