package com.flashcast.service;

import com.flashcast.dto.Style;

import java.util.List;

public interface StyleService {
    Long create(String content);

    List<Style> list(Long userId, Integer page, Integer pageSize);

    Style get(Long id);

    void delete(Long id);
}
