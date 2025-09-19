package com.flashcast.service;

import com.flashcast.convert.TemplateConverter;
import com.flashcast.dto.TemplateVO;
import com.flashcast.enums.TemplateType;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.factory.Mappers;

public interface TemplateService {
    TemplateConverter C = Mappers.getMapper(TemplateConverter.class);
    Page<TemplateVO> list(TemplateType templateType, Integer page, Integer pageSize);
}
