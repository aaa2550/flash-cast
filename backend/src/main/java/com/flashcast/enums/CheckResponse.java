package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckResponse {
    private TaskStatus status;
    private String result;
    private Long resourceId;

    public CheckResponse(TaskStatus status, String result) {
        this.status = status;
        this.result = result;
    }

    public CheckResponse(TaskStatus status) {
        this.status = status;
    }

}
