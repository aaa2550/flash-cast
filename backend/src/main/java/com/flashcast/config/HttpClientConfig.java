package com.flashcast.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.flashcast.client.AiServerClient;
import com.flashcast.client.ComfyClient;
import com.flashcast.client.DouyinClient;
import com.flashcast.interceptor.LoggingInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.util.Timeout;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import java.util.List;

@Slf4j
@Configuration
public class HttpClientConfig {

    @Value("${domain.comfy}")
    private String comfyDomain;

    @Value("${domain.ai-server}")
    private String aiServerDomain;

    @Bean
    public RestClient.Builder builder() {
        return getRestClientBuilder();
    }

    @Bean
    public LoggingInterceptor loggingInterceptor() {
        return new LoggingInterceptor();
    }

    @Bean
    public ComfyClient comfyClient(RestClient.Builder builder, LoggingInterceptor loggingInterceptor) {
        return HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(RestClientAdapter.create(builder.baseUrl(comfyDomain)
                        .requestInterceptor(loggingInterceptor).build()))
                .build().createClient(ComfyClient.class);
    }

    @Bean
    public AiServerClient aiServerClient(RestClient.Builder builder, LoggingInterceptor loggingInterceptor) {
        return HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(RestClientAdapter.create(builder.baseUrl(aiServerDomain)
                        .requestInterceptor(loggingInterceptor).build()))
                .build().createClient(AiServerClient.class);
    }

    @Bean
    public DouyinClient douyinClient(RestClient.Builder builder, LoggingInterceptor loggingInterceptor) {
        return HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(RestClientAdapter.create(builder.baseUrl(aiServerDomain)
                        .requestInterceptor(loggingInterceptor).build()))
                .build().createClient(DouyinClient.class);
    }

    private RestClient.Builder getRestClientBuilder() {
        // 创建请求配置，设置超时时间
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectionRequestTimeout(Timeout.ofMinutes(5))  // 从连接池获取连接的超时时间
                .setConnectTimeout(Timeout.ofMinutes(5))            // 建立连接的超时时间
                .setResponseTimeout(Timeout.DISABLED)               // 0表示不超时（不推荐在生产环境使用）
                .build();

// 创建HTTP客户端
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(
                HttpClients.custom()
                        .setDefaultRequestConfig(requestConfig)
                        .build()
        );
        return RestClient.builder()
                .requestFactory(requestFactory)
                .requestInterceptor((request, body, execution) -> execution.execute(request, body))
                .messageConverters(converters -> {
                    // 获取默认的 Jackson 转换器
                    ObjectMapper objectMapper = new ObjectMapper();
                    // 启用蛇形命名（下划线分隔）到驼峰命名的自动转换
                    objectMapper.setPropertyNamingStrategy(com.fasterxml.jackson.databind.PropertyNamingStrategy.SNAKE_CASE);
                    // 忽略未知属性（避免因JSON中存在Java类未定义的字段而报错）
                    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                    objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);


                    // 创建支持自定义ObjectMapper的消息转换器
                    MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
                    converter.setObjectMapper(objectMapper);
                    // 让它支持 `text/plain`
                    converter.setSupportedMediaTypes(List.of(
                            MediaType.APPLICATION_JSON,
                            MediaType.TEXT_PLAIN
                    ));
                    // 替换默认的 Jackson 转换器
                    converters.removeIf(c -> c instanceof MappingJackson2HttpMessageConverter);
                    converters.add(converter);
                });
    }

}