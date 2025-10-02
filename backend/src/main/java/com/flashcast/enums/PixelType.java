package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PixelType {
    P9_16(720, 1280);

    int width;
    int height;
}
