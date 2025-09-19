package com.flashcast.dto;

import com.flashcast.enums.TemplateType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class Template {

    private Long id;
    private String name;
    private String description;
    private TemplateType type;
    private Long relationId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}
