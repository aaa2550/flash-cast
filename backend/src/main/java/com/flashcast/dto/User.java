package com.flashcast.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class User {
    private Long id;
    private String phone;
    private String password;
    private String nickname;
    private String avatar;
    private Integer gender;
    private String birthday;
    private Integer status;
    private Date lastLoginTime;
    private Date createTime;
    private Date updateTime;
    private Integer deleted;
}
