package com.flashcast.service;

import com.flashcast.dto.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ResourceService {
    Resource upload(MultipartFile file, Long userId);
}
