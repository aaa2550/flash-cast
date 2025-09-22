package com.flashcast.repository.impl;

import com.flashcast.dto.Template;
import com.flashcast.entity.TaskDO;
import com.flashcast.entity.TemplateDO;
import com.flashcast.enums.FlagEnum;
import com.flashcast.enums.TemplateType;
import com.flashcast.mapper.TemplateMapper;
import com.flashcast.repository.TemplateRepository;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

@Repository
public class TemplateRepositoryImpl extends ServiceImpl<TemplateMapper, TemplateDO> implements TemplateRepository {

    @Override
    public void add(Template task) {
        TemplateDO taskDO = C.convertToDO(task);
        save(taskDO);
        taskDO.setId(task.getId());
    }

    @Override
    public Page<Template> find(TemplateType templateType, Integer page, Integer pageSize) {
        return C.convertToDTO(queryChain().eq(TemplateDO::getType, templateType)
                .eq(TemplateDO::getDeleted, FlagEnum.NO.ordinal())
                .page(Page.of(page, pageSize)));
    }
}
