package com.flashcast.dto;

import com.flashcast.enums.TemplateType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;

@Data
@Accessors(chain = true)
public class TemplateVO {

    private Long id;
    private String name;
    private String description;
    private TemplateType type;
    private Long relationId;
    private String url;
    private Date createTime;
    private Date updateTime;

}
