package com.flashcast.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Set;

@Getter
@AllArgsConstructor
public enum ResourceType {

    NONE(Set.of()),
    VIDEO(Set.of("mp4", "avi", "mov", "flv", "wmv", "mkv", "rmvb", "mpeg", "mpg", "3gp")),
    AUDIO(Set.of("mp3", "wav", "aac", "flac", "ogg", "m4a", "wma", "ape", "amr")),
    IMAGE(Set.of("jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico")),
    ;

    private final Set<String> extensions;


    public static ResourceType of(String extension) {
        return Arrays.stream(values()).filter(e -> e.extensions.contains(extension)).findFirst().orElse(null);
    }

}
