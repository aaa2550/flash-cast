package com.flashcast.repository.impl;

import com.flashcast.dto.Style;
import com.flashcast.entity.ResourceDO;
import com.flashcast.entity.StyleDO;
import com.flashcast.enums.FlagEnum;
import com.flashcast.mapper.StyleMapper;
import com.flashcast.repository.StyleRepository;
import com.mybatisflex.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StyleRepositoryImpl extends ServiceImpl<StyleMapper, StyleDO> implements StyleRepository {

    @Override
    public void add(Style style) {
        StyleDO styleDO = C.convertToDO(style);
        save(styleDO);
        styleDO.setId(style.getId());
    }

    @Override
    public List<Style> find(Long userId) {
        return C.convertToDTO(queryChain().eq(StyleDO::getUserId, userId)
                .eq(StyleDO::getDeleted, FlagEnum.NO.ordinal())
                .list());
    }

    @Override
    public Style get(Long id) {
        return C.convertToDTO(queryChain().eq(StyleDO::getId, id)
                .eq(StyleDO::getDeleted, FlagEnum.NO.ordinal())
                .one());
    }
}
