package com.flashcast.service.impl;

import cn.hutool.core.lang.Pair;
import com.flashcast.client.RunningHubClient;
import com.flashcast.dto.Resource;
import com.flashcast.dto.RunningHubCreateBody;
import com.flashcast.dto.RunningHubResponse;
import com.flashcast.dto.RunningHubStatusBody;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.enums.PixelType;
import com.flashcast.enums.RunningHubStatus;
import com.flashcast.exception.BusinessException;
import com.flashcast.response.R;
import com.flashcast.service.RunningHubService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.PathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
public class RunningHubServiceImpl implements RunningHubService {

    @Value("${runningHub.apiKey}")
    private String apiKey;
    @Autowired
    private RunningHubClient runningHubClient;

    @Override
    public String runTimbreSynthesisTask(String path, String content, String emotionText) {

        List<RunningHubCreateBody.NodeInfo> nodeInfoList = new ArrayList<>();
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(2).setFieldName("emo_text").setFieldValue(StringUtils.isEmpty(emotionText) ? "稳重" : emotionText));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(3).setFieldName("audio").setFieldValue(path));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(4).setFieldName("text").setFieldValue(content));

        ResponseEntity<R<RunningHubResponse>> rResponseEntity = runningHubClient.create(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setWorkflowId("1974699622956404738")
                .setNodeInfoList(nodeInfoList));
        RunningHubResponse runningHubResponse = rResponseEntity.getBody().getData();
        return runningHubResponse.getTaskId();
    }

    @Override
    public RunningHubStatus check(String runningHubTaskId) {
        ResponseEntity<R<RunningHubStatus>> status = runningHubClient.status(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setTaskId(runningHubTaskId));
        R<RunningHubStatus> runningHubStatusR = status.getBody();
        return runningHubStatusR.getData();
    }

    @Override
    public String getResult(String runningHubTaskId) {
        R<List<RunningHubResponse>> outputs = runningHubClient.outputs(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setTaskId(runningHubTaskId));
        List<RunningHubResponse> responseList = outputs.getData();
        if (CollectionUtils.isEmpty(responseList)) {
            return null;
        }
        return responseList.stream().findFirst().map(RunningHubResponse::getFileUrl).orElse(null);
    }

    @Override
    public String upload(String path, String fileType) {
        R<RunningHubResponse> runningHubResponse = runningHubClient.upload(new FileSystemResource(Path.of(path)),
                apiKey,
                fileType);
        return runningHubResponse.getData().getFileName();
    }

    @Override
    public String runVideoSynthesisWorkflow(String videoPath, String audioPath, PixelType pixelType) {

        List<RunningHubCreateBody.NodeInfo> nodeInfoList = new ArrayList<>();
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(222).setFieldName("video").setFieldValue(videoPath));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(125).setFieldName("audio").setFieldValue(audioPath));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("width").setFieldValue(pixelType.getWidth()));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("height").setFieldValue(pixelType.getHeight()));

        //nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(122).setFieldName("base_precision").setFieldValue("fp8"));
        //nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(122).setFieldName("quantization").setFieldValue("8bit"));
        //nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(122).setFieldName("load_device").setFieldValue("offload_device"));
//        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(136).setFieldName("precision").setFieldValue("fp8"));
//        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(136).setFieldName("quantization").setFieldValue("8bit"));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("frame_window_size").setFieldValue("64"));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("tiled_vae").setFieldValue("true"));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(222).setFieldName("frame_load_cap").setFieldValue("32"));

        ResponseEntity<R<RunningHubResponse>> rResponseEntity = runningHubClient.create(new RunningHubCreateBody()
                .setWorkflowId("1967526186341502977")
                .setApiKey(apiKey)
                .setNodeInfoList(nodeInfoList));
        R<RunningHubResponse> douyinStatusR = rResponseEntity.getBody();
        return douyinStatusR.getData().getTaskId();
    }

    @Override
    public String timbreSynthesis(Long subTaskId, String audioPath, String content, String emotionText) {
        String runningHubPath = upload(audioPath, "audio");
        return runTimbreSynthesisTask(
                runningHubPath,
                content,
                emotionText
        );


//        do {
//            try {
//                Thread.sleep(1000L);
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
//            RunningHubStatus runningHubStatus = check(runningHubTaskId);
//            if (runningHubStatus.equals(RunningHubStatus.SUCCESS)) {
//                return getResult(runningHubTaskId);
//            } else if (runningHubStatus.equals(RunningHubStatus.FAILED)) {
//                return null;
//            }
//        } while (true);
    }

    @Override
    public String videoSynthesis(String audioPath, String videoPath, PixelType pixelType) {

        Pair<String, String> pair = asyncUpload(audioPath, videoPath);

        return runVideoSynthesisWorkflow(
                pair.getValue(),
                pair.getKey(),
                pixelType);
    }

    public Pair<String, String> asyncUpload(String audioPath, String videoPath) {
        CompletableFuture<String> audioFuture = CompletableFuture.supplyAsync(() -> upload(audioPath, "audio"));
        CompletableFuture<String> videoFuture = CompletableFuture.supplyAsync(() -> upload(videoPath, "video"));
        CompletableFuture<Void> allDone = CompletableFuture.allOf(audioFuture, videoFuture);

        try {
            allDone.get(); // 阻塞等待所有任务完成
            return Pair.of(audioFuture.get(), videoFuture.get());
        } catch (Throwable e) {
            log.error("asyncUpload error.audioPath={},videoPath={}", audioPath, videoPath, e);
            throw new BusinessException(e);
        }
    }

}
