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

    public CheckResponse(TaskStatus status) {
        this.status = status;
    }

}
