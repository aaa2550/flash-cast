package com.flashcast.service;

import com.flashcast.dto.Resource;
import com.flashcast.enums.ResourceType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResourceService {
    Resource upload(MultipartFile file, Long userId);

    List<Resource> list(Long userId, ResourceType resourceType);

    List<Resource> find(List<Long> resourceIds);
}
