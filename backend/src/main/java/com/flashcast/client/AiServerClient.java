package com.flashcast.client;

import com.flashcast.dto.GenerateResp;
import com.flashcast.dto.SubmitBody;
import com.flashcast.dto.TaskInfoResponse;
import com.flashcast.response.R;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(value = "/api",contentType = "application/json")
public interface AiServerClient {
    @PostExchange("/currentTaskNum")
    R<TaskInfoResponse> queryServerTaskInfo();

    @PostExchange("/tasks")
    R<String> submit(@RequestBody SubmitBody submitBody);

    @PostExchange("/link_parse")
    R<String> linkParse(@RequestParam("link") String link);

    @GetExchange("/tasks/{taskId}")
    R<GenerateResp> check(@PathVariable("taskId") Long id);

    @PostExchange("/rewrite")
    R<String> rewrite(@RequestParam("content") String content,
                      @RequestParam("styles") String styles,
                      @RequestParam("tone") String tone,
                      @RequestParam("extra-instructions") String extraInstructions);
}
