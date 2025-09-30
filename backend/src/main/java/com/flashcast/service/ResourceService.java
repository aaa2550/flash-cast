package com.flashcast.service;

import com.flashcast.dto.Resource;
import com.flashcast.enums.ResourceType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResourceService {
    Resource upload(MultipartFile file, Long userId);

    List<Resource> list(Long userId, ResourceType resourceType, Integer page, Integer pageSize);

    List<Resource> find(List<Long> resourceIds);

    Resource get(Long id);

    String getResourcePath();

    void remove(Long id);

    List<Resource> findByTaskId(Long taskId);
}
