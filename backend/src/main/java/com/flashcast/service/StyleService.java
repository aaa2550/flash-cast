package com.flashcast.service;

import com.flashcast.dto.Style;

import java.util.List;

public interface StyleService {
    Long create(String content);

    List<Style> list(Long userId);

    Style get(Long id);
}
