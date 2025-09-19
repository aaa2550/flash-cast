package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ResponseCode {
    SUCCESS(200),
    ILLEGAL_ARGUMENT(100001),
    SERVER_ERROR(100002),
    RESOURCE_NOT_FOUND(100003),
    ;
    
    private final int code;
}
