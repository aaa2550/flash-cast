package com.flashcast.service.impl;

import com.flashcast.dto.Style;
import com.flashcast.repository.StyleRepository;
import com.flashcast.service.StyleService;
import com.flashcast.util.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StyleServiceImpl implements StyleService {

    @Autowired
    private StyleRepository styleRepository;

    @Override
    public Long create(String content) {
        Style style = new Style()
                .setUserId(UserContext.getCurrentUserId())
                .setContent(content);
        styleRepository.add(style);
        return style.getId();
    }

    @Override
    public List<Style> list(Long userId) {
        return styleRepository.find(userId);
    }
}
