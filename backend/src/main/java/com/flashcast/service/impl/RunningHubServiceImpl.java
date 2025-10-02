package com.flashcast.service.impl;

import com.flashcast.client.RunningHubClient;
import com.flashcast.dto.RunningHubCreateBody;
import com.flashcast.dto.RunningHubResponse;
import com.flashcast.dto.RunningHubStatusBody;
import com.flashcast.enums.DouyinStatus;
import com.flashcast.enums.PixelType;
import com.flashcast.enums.RunningHubStatus;
import com.flashcast.response.R;
import com.flashcast.service.RunningHubService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.PathResource;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Service
public class RunningHubServiceImpl implements RunningHubService {

    @Value("${runningHub.apiKey}")
    private String apiKey;
    @Autowired
    private RunningHubClient runningHubClient;

    @Override
    public String runTimbreSynthesisTask(String path, String content, String emotionText) {

        List<RunningHubCreateBody.NodeInfo> nodeInfoList = new ArrayList<>();
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(2).setFieldName("emo_text").setFieldValue(StringUtils.isEmpty(emotionText) ? "沉稳" : emotionText));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(3).setFieldName("audio").setFieldValue(path));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(4).setFieldName("text").setFieldValue(content));

        RunningHubResponse runningHubResponse = runningHubClient.runTask(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setWebappId("1972192405107765250")
                .setNodeInfoList(nodeInfoList)).getData();
        return runningHubResponse.getTaskId();
    }

    @Override
    public RunningHubStatus check(String runningHubTaskId) {
        R<RunningHubStatus> runningHubStatusR = runningHubClient.status(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setTaskId(runningHubTaskId));
        return runningHubStatusR.getData();
    }

    @Override
    public String getResult(String runningHubTaskId) {
        R<RunningHubResponse> outputs = runningHubClient.outputs(new RunningHubCreateBody()
                .setApiKey(apiKey)
                .setTaskId(runningHubTaskId));
        return outputs.getData().getFileUrl();
    }

    @Override
    public String upload(String path, String fileType) {
        R<RunningHubResponse> runningHubResponseR = runningHubClient.upload(new PathResource(Path.of(path)),
                apiKey,
                fileType);
        return runningHubResponseR.getData().getFileName();
    }

    @Override
    public String runVideoSynthesisWorkflow(String videoPath, String audioPath, PixelType pixelType) {

        List<RunningHubCreateBody.NodeInfo> nodeInfoList = new ArrayList<>();
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(222).setFieldName("video").setFieldValue(videoPath));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(125).setFieldName("audio").setFieldValue(audioPath));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("width").setFieldValue(pixelType.getWidth()));
        nodeInfoList.add(new RunningHubCreateBody.NodeInfo().setNodeId(192).setFieldName("height").setFieldValue(pixelType.getHeight()));

        R<RunningHubResponse> douyinStatusR = runningHubClient.create(new RunningHubCreateBody()
                .setWorkflowId("1967526186341502977")
                .setApiKey(apiKey)
                .setNodeInfoList(nodeInfoList));
        return douyinStatusR.getData().getTaskId();
    }
}
