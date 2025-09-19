package com.flashcast.dto;

import com.flashcast.enums.ResourceType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class Resource {
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
