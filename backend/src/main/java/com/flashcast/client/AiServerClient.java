package com.flashcast.client;

import com.flashcast.dto.SubTask;
import com.flashcast.dto.TaskInfoResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface AiServerClient {
    @PostExchange("/currentTaskNum")
    TaskInfoResponse queryServerTaskInfo();

    @PostExchange("/submit")
    void submit(@RequestBody SubTask subTask);
}
