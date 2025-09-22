package com.flashcast.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_style")
public class StyleDO {

    @Id
    private Long id;
    private String name;
    private String content;
    private Long userId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}