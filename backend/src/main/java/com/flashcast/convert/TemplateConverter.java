package com.flashcast.convert;

import com.flashcast.dto.Template;
import com.flashcast.dto.TemplateVO;
import com.flashcast.entity.TemplateDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface TemplateConverter {

    TemplateConverter C = Mappers.getMapper(TemplateConverter.class);

    Template convertToDTO(TemplateDO obj);

    List<Template> convertToDTO(List<TemplateDO> list);

    Page<Template> convertToDTO(Page<TemplateDO> page);

    Page<TemplateVO> convertToVO(Page<Template> page);

    TemplateDO convertToDO(Template obj);

    List<TemplateDO> convertToDO(List<Template> list);

    default List<Long> toId(List<TemplateVO> list) {
        return list.stream().map(TemplateVO::getRelationId).toList();
    }
}
