package com.flashcast.client;

import com.flashcast.dto.RunningHubCreateBody;
import com.flashcast.dto.RunningHubResponse;
import com.flashcast.enums.RunningHubStatus;
import com.flashcast.response.R;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(headers = {"Host=www.runninghub.cn"})
public interface RunningHubClient {

    @PostExchange("/task/openapi/upload")
    R<RunningHubResponse> upload(
            @RequestPart("file") Resource file,
            @RequestPart("apiKey") String apiKey,
            @RequestPart("fileType") String fileType);

    @GetExchange(value = "/task/openapi/status")
    R<RunningHubStatus> status(@RequestParam("apiKey") String apiKey, @RequestParam("taskId") String runningHubTaskId);

    @PostExchange(value = "/task/openapi/cancel", contentType = "application/json")
    R<Void> cancel(@RequestBody RunningHubCreateBody body);

    @PostExchange(value = "/task/openapi/create", contentType = "application/json")
    ResponseEntity<R<RunningHubResponse>> create(@RequestBody RunningHubCreateBody body);

    @PostExchange(value = "/task/openapi/ai-app/run", contentType = "application/json")
    ResponseEntity<R<RunningHubResponse>> runTask(@RequestBody RunningHubCreateBody body);

    @PostExchange(value = "/task/openapi/outputs", contentType = "application/json")
    R<RunningHubResponse> outputs(@RequestBody RunningHubCreateBody body);

}
