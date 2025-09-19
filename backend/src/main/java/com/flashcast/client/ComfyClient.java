package com.flashcast.client;

import com.flashcast.dto.GenerateBody;
import com.flashcast.dto.GenerateResp;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(contentType = "application/json")
public interface ComfyClient {
    @PostExchange("/generate")
    GenerateResp contentGeneration(@RequestBody GenerateBody generateBody);
}
