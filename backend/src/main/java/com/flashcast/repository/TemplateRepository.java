package com.flashcast.repository;

import com.flashcast.convert.TemplateConverter;
import com.flashcast.dto.Template;
import com.flashcast.entity.TemplateDO;
import com.flashcast.enums.TemplateType;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

public interface TemplateRepository extends IService<TemplateDO> {
    TemplateConverter C = Mappers.getMapper(TemplateConverter.class);

    void add(Template task);

    Page<Template> find(TemplateType templateType, Integer page, Integer pageSize);
}
