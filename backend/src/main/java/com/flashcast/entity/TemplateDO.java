package com.flashcast.entity;

import com.flashcast.enums.TemplateType;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_template")
public class TemplateDO {

    @Id(keyType = KeyType.Auto)
    private Long id;
    private String name;
    private String description;
    private TemplateType type;
    private Long relationId;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;

}
