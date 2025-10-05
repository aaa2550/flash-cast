package com.flashcast.dto;


import com.flashcast.enums.DouyinStatus;
import lombok.Data;

@Data
public class DouyinUserInfo {
    private String douyinId;
    private String nickname;
    private String cookies;
    private DouyinStatus status;
}
