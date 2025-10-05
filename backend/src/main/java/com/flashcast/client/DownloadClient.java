package com.flashcast.client;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface DownloadClient {
    // 不指定路径
    @GetExchange("{url}")
    ResponseEntity<Resource> downloadFile(@PathVariable String url);
}
