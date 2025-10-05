package com.flashcast.service;

import com.flashcast.enums.PixelType;
import com.flashcast.enums.RunningHubStatus;

public interface RunningHubService {
    String runTimbreSynthesisTask(String path, String content, String emotionText);

    RunningHubStatus check(String runningHubTaskId);

    String getResult(String runningHubTaskId);

    String upload(String path, String fileType);

    String runVideoSynthesisWorkflow(String videoPath, String audioPath, PixelType pixelType);

    String timbreSynthesis(Long subTaskId, String audioPath, String content, String emotionText);

    String videoSynthesis(String audioPath, String videoPath, PixelType pixelType);
}
