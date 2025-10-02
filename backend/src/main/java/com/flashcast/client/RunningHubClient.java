package com.flashcast.client;

import com.flashcast.dto.RunningHubCreateBody;
import com.flashcast.dto.RunningHubResponse;
import com.flashcast.enums.RunningHubStatus;
import com.flashcast.response.R;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange("/api")
public interface RunningHubClient {

    @PostExchange("/task/openapi/upload")
    R<RunningHubResponse> upload(
            @RequestHeader("Host=www.runninghub.cn")
            @RequestPart("file") Resource file,
            @RequestPart("apiKey") String apiKey,
            @RequestPart("fileType") String fileType);

    @GetExchange("/task/openapi/status")
    R<RunningHubStatus> status(@RequestBody RunningHubCreateBody body);

    @PostExchange("/task/openapi/cancel")
    R<Void> cancel(@RequestBody RunningHubCreateBody body);

    @PostExchange("/task/openapi/create")
    R<RunningHubResponse> create(@RequestBody RunningHubCreateBody body);

    @PostExchange("/task/openapi/ai-app/run")
    R<RunningHubResponse> runTask(@RequestBody RunningHubCreateBody body);

    @PostExchange("/task/openapi/outputs")
    R<RunningHubResponse> outputs(@RequestBody RunningHubCreateBody body);

}
