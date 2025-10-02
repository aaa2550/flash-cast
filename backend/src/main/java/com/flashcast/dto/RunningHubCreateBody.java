package com.flashcast.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain = true)
@Data
public class RunningHubCreateBody {
    private String webappId;
    private String apiKey;
    private String workflowId;
    private String webhookUrl;
    private String workflow;
    private String taskId;
    private List<NodeInfo> nodeInfoList;

    @AllArgsConstructor
    @NoArgsConstructor
    @Accessors(chain = true)
    @Data
    public static class NodeInfo {
        private Integer nodeId;
        private String fieldName;
        private Object fieldValue;
    }
}
