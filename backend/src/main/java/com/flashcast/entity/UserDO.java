package com.flashcast.entity;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(value = "fc_user")
public class UserDO {

    @Id(keyType = KeyType.Auto)
    private Long id;
    private String phone;
    private String nickname;
    private String avatar;
    private String douyinUserInfo;
    private Integer gender;
    private String birthday;
    private Integer status;
    private Date lastLoginTime;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;
}