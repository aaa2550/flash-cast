package com.flashcast.service.impl;

import com.flashcast.dto.Resource;
import com.flashcast.enums.ResourceType;
import com.flashcast.repository.ResourceRepository;
import com.flashcast.service.ResourceService;
import com.flashcast.util.FileUtil;
import com.flashcast.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.flashcast.util.FileUtil.getPath;
import static com.flashcast.util.FileUtil.transferTo;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;
    @Value("${resource.path}")
    private String resourcePath;

    @Override
    public Resource upload(MultipartFile file, Long userId) {

        Path uploadPath = getPath(resourcePath + userId);

        String originalFilename = file.getOriginalFilename();
        String fileExtension = Objects.requireNonNull(originalFilename).substring(originalFilename.lastIndexOf(".") + 1);
        String newFilename = UUID.randomUUID() + "." + fileExtension;

        Path filePath = uploadPath.resolve(newFilename);
        transferTo(file, filePath);

        Resource resource = new Resource()
                .setPath(filePath.toString().replace(resourcePath, "/"))
                .setName(originalFilename.substring(0, originalFilename.lastIndexOf(".")))
                .setSuffix(fileExtension)
                .setType(ResourceType.of(fileExtension))
                .setUserId(userId)
                .setSize(file.getSize());
        resourceRepository.add(resource);

        return resource;

    }

    @Override
    public List<Resource> list(Long userId, ResourceType resourceType, Integer page, Integer pageSize) {
        return resourceRepository.find(userId, resourceType, page, pageSize);
    }

    @Override
    public List<Resource> find(List<Long> ids) {
        return resourceRepository.find(ids);
    }

    @Override
    public Resource get(Long id) {
        return resourceRepository.get(id);
    }

    @Override
    public String getResourcePath() {
        return resourcePath;
    }

    @Override
    public void remove(Long id) {
        Resource resource = resourceRepository.get(id);
        FileUtil.delete(resourcePath + resource.getPath());
        resourceRepository.delete(id);
    }

    @Override
    public List<Resource> findByTaskId(Long taskId) {
        return resourceRepository.findByTaskId(taskId);
    }

    @Override
    public Long add(String path) {
        String suffix = path.substring(path.lastIndexOf(".") + 1);
        Resource resource = new Resource()
                .setPath(path)
                .setName(path.substring(0, path.lastIndexOf(".")))
                .setSuffix(suffix)
                .setType(ResourceType.of(suffix))
                .setUserId(UserContext.getCurrentUserId())
                .setSize(0L);
        resourceRepository.add(resource);
        return resource.getId();
    }
}
