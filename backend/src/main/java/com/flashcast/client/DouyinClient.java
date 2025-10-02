package com.flashcast.client;

import com.flashcast.dto.DouyinUserInfo;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.response.R;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange("/api")
public interface DouyinClient {

    @GetExchange("/douyin/get_image_base64")
    R<String> douyinGetImageBase64(@RequestParam("user_id") Long userId);

    @GetExchange("/douyin/get_cookies")
    R<DouyinUserInfo> douyinGetCookies(@RequestParam("user_id") Long userId);

    @PostExchange("/douyin/publish")
    R<Void> douyinPublish(@RequestParam("user_id") Long userId, @RequestParam("task_id") Long taskId, @RequestParam("path") String path);

    @PostExchange("/douyin/get_status")
    R<DouyinStatus> douyinGetStatus(@RequestParam("task_id") Long taskId);

}
