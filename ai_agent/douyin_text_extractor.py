
import os
import re
import json
import tempfile
from pathlib import Path
from typing import Optional
from urllib import request
from http import HTTPStatus

import dashscope
import ffmpeg
import requests

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/121.0.2277.107 Version/17.0 Mobile/15E148 Safari/604.1'
}
DEFAULT_MODEL = "paraformer-v2"

class DouyinTextExtractor:
    """
    用于提取抖音视频文本内容的独立工具类。
    只需传入 api_key 和单个抖音分享链接，返回解析后的文本内容。
    """
    def __init__(self, api_key: str, model: Optional[str] = None):
        if not api_key:
            raise ValueError("api_key 不能为空")
        self.api_key = api_key
        self.model = model or DEFAULT_MODEL
        self.temp_dir = Path(tempfile.mkdtemp())
        dashscope.api_key = api_key

    def __del__(self):
        import shutil
        if hasattr(self, 'temp_dir') and self.temp_dir.exists():
            shutil.rmtree(self.temp_dir, ignore_errors=True)

    def extract_text(self, link: str) -> str:
        """
        传入抖音分享链接，返回视频文本内容。
        :param link: 抖音分享链接
        :return: 文本内容字符串
        """
        if not link:
            raise ValueError("link 不能为空")
        video_info = self._parse_share_url(link)
        text_content = self._extract_text_from_video_url(video_info['url'])
        return text_content.strip() if text_content else ""

    def _parse_share_url(self, share_text: str) -> dict:
        urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!\*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', share_text)
        if not urls:
            raise ValueError("未找到有效的分享链接")

        share_url = urls[0]
        share_response = requests.get(share_url, headers=HEADERS)
        video_id = share_response.url.split("?")[0].strip("/").split("/")[-1]
        share_url = f'https://www.iesdouyin.com/share/video/{video_id}'

        response = requests.get(share_url, headers=HEADERS)
        response.raise_for_status()

        pattern = re.compile(
            pattern=r"window\._ROUTER_DATA\s*=\s*(.*?)</script>",
            flags=re.DOTALL,
        )
        find_res = pattern.search(response.text)

        if not find_res or not find_res.group(1):
            raise ValueError("从HTML中解析视频信息失败")

        json_data = json.loads(find_res.group(1).strip())
        VIDEO_ID_PAGE_KEY = "video_(id)/page"
        NOTE_ID_PAGE_KEY = "note_(id)/page"

        if VIDEO_ID_PAGE_KEY in json_data["loaderData"]:
            original_video_info = json_data["loaderData"][VIDEO_ID_PAGE_KEY]["videoInfoRes"]
        elif NOTE_ID_PAGE_KEY in json_data["loaderData"]:
            original_video_info = json_data["loaderData"][NOTE_ID_PAGE_KEY]["videoInfoRes"]
        else:
            raise Exception("无法从JSON中解析视频或图集信息")

        data = original_video_info["item_list"][0]
        video_url = data["video"]["play_addr"]["url_list"][0].replace("playwm", "play")
        desc = data.get("desc", "").strip() or f"douyin_{video_id}"
        desc = re.sub(r'[\\/:*?"<>|]', '_', desc)

        return {
            "url": video_url,
            "title": desc,
            "video_id": video_id
        }

    def _extract_text_from_video_url(self, video_url: str) -> str:
        task_response = dashscope.audio.asr.Transcription.async_call(
            model=self.model,
            file_urls=[video_url],
            language_hints=['zh', 'en']
        )
        transcription_response = dashscope.audio.asr.Transcription.wait(
            task=task_response.output.task_id
        )
        if transcription_response.status_code == HTTPStatus.OK:
            for transcription in transcription_response.output['results']:
                url = transcription['transcription_url']
                result = json.loads(request.urlopen(url).read().decode('utf8'))
                temp_json_path = self.temp_dir / 'transcription.json'
                with open(temp_json_path, 'w') as f:
                    json.dump(result, f, indent=4, ensure_ascii=False)
                if 'transcripts' in result and len(result['transcripts']) > 0:
                    return result['transcripts'][0]['text']
                else:
                    return "未识别到文本内容"
        else:
            raise Exception(f"转录失败: {transcription_response.output.message}")
