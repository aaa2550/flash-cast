package com.flashcast.service.impl;

import com.flashcast.repository.ResourceRepository;
import com.flashcast.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResourceServiceImpl implements ResourceService {
    @Autowired
    private ResourceRepository resourceRepository;
}
