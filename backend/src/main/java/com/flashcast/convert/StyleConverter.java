package com.flashcast.convert;

import com.flashcast.dto.Style;
import com.flashcast.entity.StyleDO;
import com.mybatisflex.core.paginate.Page;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface StyleConverter {

    StyleConverter C = Mappers.getMapper(StyleConverter.class);

    Style convertToDTO(StyleDO obj);

    List<Style> convertToDTO(List<StyleDO> list);

    Page<Style> convertToDTO(Page<StyleDO> page);

    StyleDO convertToDO(Style obj);

    List<StyleDO> convertToDO(List<Style> list);
}
