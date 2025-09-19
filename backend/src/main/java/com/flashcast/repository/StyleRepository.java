package com.flashcast.repository;

import com.flashcast.convert.StyleConverter;
import com.flashcast.dto.Style;
import com.flashcast.entity.StyleDO;
import com.mybatisflex.core.service.IService;
import org.mapstruct.factory.Mappers;

import java.util.List;

public interface StyleRepository extends IService<StyleDO> {
    StyleConverter C = Mappers.getMapper(StyleConverter.class);

    void add(Style style);

    List<Style> find(Long userId);
}
