package com.flashcast.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.Map;

@Data
@Accessors(chain = true)
public class SubmitBody {
    private String strategy;
    private Map<String, Object> params = new HashMap<>();

    public void put(String key, Object val) {
        params.put(key, val);
    }
}
