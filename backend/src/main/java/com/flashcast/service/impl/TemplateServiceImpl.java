package com.flashcast.service.impl;

import com.flashcast.dto.Resource;
import com.flashcast.dto.TemplateVO;
import com.flashcast.enums.TemplateType;
import com.flashcast.repository.TemplateRepository;
import com.flashcast.service.ResourceService;
import com.flashcast.service.TemplateService;
import com.mybatisflex.core.paginate.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TemplateServiceImpl implements TemplateService {

    @Autowired
    private TemplateRepository templateRepository;
    @Autowired
    private ResourceService resourceService;

    @Override
    public Page<TemplateVO> list(TemplateType templateType, Integer page, Integer pageSize) {
        Page<TemplateVO> templateVOPage = C.convertToVO(templateRepository.find(templateType, page, pageSize));
        setUrls(templateVOPage.getRecords());
        return templateVOPage;
    }

    private void setUrls(List<TemplateVO> templateVOS) {
        List<Resource> resources = resourceService.find(C.toId(templateVOS));
        Map<Long, String> resourceMap = resources.stream().collect(Collectors.toMap(Resource::getId, Resource::getPath));
        templateVOS.forEach(template -> template.setUrl(resourceMap.get(template.getRelationId())));
    }
}
