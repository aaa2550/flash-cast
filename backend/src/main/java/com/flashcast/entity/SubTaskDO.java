package com.flashcast.entity;

import com.flashcast.enums.CalcPlatformType;
import com.flashcast.enums.SubTaskType;
import com.flashcast.enums.TaskStatus;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_sub_task")
public class SubTaskDO {

    @Id(keyType = KeyType.Auto)
    private Long id;
    private Long mainTaskId;
    private SubTaskType type;
    private Integer seq;
    private String parameter;
    private TaskStatus status;
    private String content;
    private CalcPlatformType platformType;
    private String dependOnIds;
    private String runningHubId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}