package com.flashcast.util;

import com.flashcast.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
public class FileUtil {
    public static Path getPath(String path) {
        Path uploadPath = Paths.get(path);
        if (!Files.exists(uploadPath)) {
            try {
                Files.createDirectories(uploadPath);
            } catch (IOException e) {
                log.error("getPath error.path={}", path, e);
                throw new BusinessException(e);
            }
        }
        return uploadPath;
    }

    public static void transferTo(MultipartFile file, Path filePath) {
        try {
            file.transferTo(filePath);
        } catch (IOException e) {
            log.error("transferTo error.filePath={}", filePath, e);
            throw new BusinessException(e);
        }
    }

    public static boolean delete(String path) {
        File file = new File(path);
        return file.delete();
    }
}
