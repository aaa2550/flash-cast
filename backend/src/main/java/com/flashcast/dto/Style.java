package com.flashcast.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class Style {
    private Long id;
    private String name;
    private String content;
    private Long userId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;
}
