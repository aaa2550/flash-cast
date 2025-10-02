package com.flashcast.client;

import com.flashcast.dto.GenerateResp;
import com.flashcast.dto.SubmitBody;
import com.flashcast.dto.TaskInfoResponse;
import com.flashcast.response.R;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange("/api")
public interface AiServerClient {
    @PostExchange("/currentTaskNum")
    R<TaskInfoResponse> queryServerTaskInfo();

    @PostExchange("/submit")
    R<Void> submit(@RequestBody SubmitBody submitBody);

    @PostExchange("/check")
    R<GenerateResp> check(Long id);

}
