package com.flashcast.entity;

import com.flashcast.enums.ResourceType;
import com.flashcast.enums.TaskStatus;
import com.flashcast.enums.TaskType;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_resource")
public class ResourceDO {

    @Id
    private Long id;
    private ResourceType type;
    private Long userId;
    private String name;
    private String path;
    private String suffix;
    private Long size;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}