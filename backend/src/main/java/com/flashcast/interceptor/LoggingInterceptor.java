package com.flashcast.interceptor;

import com.flashcast.config.BufferingClientHttpResponseWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Slf4j
public class LoggingInterceptor implements ClientHttpRequestInterceptor {

    private static final Set<String> filter = Set.of("upload", "/oss/file", "oss-cn-beijing.aliyuncs.com", "generate");

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
                                        ClientHttpRequestExecution execution) throws IOException {

        if (filter.stream().anyMatch(url -> request.getURI().toString().contains(url))) {
            return execution.execute(request, body);
        }

        // 打印请求信息
        logRequest(request, body);

        // 执行请求
        ClientHttpResponse response = new BufferingClientHttpResponseWrapper(execution.execute(request, body));

        // 打印响应信息
        logResponse(response);

        return response;
    }

    private void logRequest(HttpRequest request, byte[] body) {
        log.info("=== Request Start ===");
        log.info("URI: {}", request.getURI());
        log.info("Method: {}", request.getMethod());
        log.info("Headers: {}", request.getHeaders());

        log.info("Request Body: {}", new String(body, StandardCharsets.UTF_8));

        log.info("=== Request End ===");
    }

    private void logResponse(ClientHttpResponse response) throws IOException {
        log.info("=== Response Start ===");
        log.info("Status Code: {}", response.getStatusCode());
        log.info("Status Text: {}", response.getStatusText());
        log.info("Headers: {}", response.getHeaders());

        // 注意：响应体只能读取一次，需要包装响应
        log.info("Response Body: {}", StreamUtils.copyToString(response.getBody(), StandardCharsets.UTF_8));

        log.info("=== Response End ===");
    }
}