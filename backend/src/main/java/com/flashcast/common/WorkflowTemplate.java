package com.flashcast.common;

public class WorkflowTemplate {
    private final static String ID1967526186341502977 = "{\n" +
            "  \"120\": {\n" +
            "    \"inputs\": {\n" +
            "      \"model\": \"InfiniteTalk/Wan2_1-InfiniTetalk-Single_fp16.safetensors\"\n" +
            "    },\n" +
            "    \"class_type\": \"MultiTalkModelLoader\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Multi/InfiniteTalk Model Loader\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"122\": {\n" +
            "    \"inputs\": {\n" +
            "      \"model\": \"Wan2_1-I2V-14B-480p_fp8_e4m3fn_scaled_KJ.safetensors\",\n" +
            "      \"base_precision\": \"fp16\",\n" +
            "      \"quantization\": \"disabled\",\n" +
            "      \"load_device\": \"offload_device\",\n" +
            "      \"attention_mode\": \"sdpa\",\n" +
            "      \"block_swap_args\": [\n" +
            "        \"134\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"lora\": [\n" +
            "        \"138\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"multitalk_model\": [\n" +
            "        \"120\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoModelLoader\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Model Loader\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"125\": {\n" +
            "    \"inputs\": {\n" +
            "      \"audio\": \"f06ba7ade4251229856b06ab8df91293127278c8c205d7135fcc01d34b186f10.WAV\",\n" +
            "      \"audioUI\": \"\"\n" +
            "    },\n" +
            "    \"class_type\": \"LoadAudio\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Load Audio\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"129\": {\n" +
            "    \"inputs\": {\n" +
            "      \"model_name\": \"Wan2_1_VAE_bf16.safetensors\",\n" +
            "      \"precision\": \"bf16\"\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoVAELoader\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo VAE Loader\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"130\": {\n" +
            "    \"inputs\": {\n" +
            "      \"enable_vae_tiling\": false,\n" +
            "      \"tile_x\": 272,\n" +
            "      \"tile_y\": 272,\n" +
            "      \"tile_stride_x\": 144,\n" +
            "      \"tile_stride_y\": 128,\n" +
            "      \"normalization\": \"default\",\n" +
            "      \"vae\": [\n" +
            "        \"129\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"samples\": [\n" +
            "        \"220\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoDecode\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Decode\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"131\": {\n" +
            "    \"inputs\": {\n" +
            "      \"frame_rate\": 25,\n" +
            "      \"loop_count\": 0,\n" +
            "      \"filename_prefix\": \"WanVideo2_1_multitalk\",\n" +
            "      \"format\": \"video/h264-mp4\",\n" +
            "      \"pix_fmt\": \"yuv420p\",\n" +
            "      \"crf\": 19,\n" +
            "      \"save_metadata\": true,\n" +
            "      \"trim_to_audio\": true,\n" +
            "      \"pingpong\": false,\n" +
            "      \"save_output\": true,\n" +
            "      \"no_preview\": false,\n" +
            "      \"images\": [\n" +
            "        \"130\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"audio\": [\n" +
            "        \"194\",\n" +
            "        1\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"VHS_VideoCombine\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Video Combine \uD83C\uDFA5\uD83C\uDD65\uD83C\uDD57\uD83C\uDD62\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"134\": {\n" +
            "    \"inputs\": {\n" +
            "      \"blocks_to_swap\": 20,\n" +
            "      \"offload_img_emb\": false,\n" +
            "      \"offload_txt_emb\": false,\n" +
            "      \"use_non_blocking\": true,\n" +
            "      \"vace_blocks_to_swap\": 0,\n" +
            "      \"prefetch_blocks\": 0,\n" +
            "      \"block_swap_debug\": false\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoBlockSwap\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Block Swap\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"135\": {\n" +
            "    \"inputs\": {\n" +
            "      \"positive_prompt\": \"A woman passionately singing. A close-up shot captures her expressive performance.\",\n" +
            "      \"negative_prompt\": \"bright tones, overexposed, static, blurred details, subtitles, style, works, paintings, images, static, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn faces, deformed, disfigured, misshapen limbs, fused fingers, still picture, messy background, three legs, many people in the background, walking backwards\",\n" +
            "      \"force_offload\": true,\n" +
            "      \"use_disk_cache\": false,\n" +
            "      \"device\": \"gpu\",\n" +
            "      \"t5\": [\n" +
            "        \"136\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoTextEncode\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo TextEncode\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"136\": {\n" +
            "    \"inputs\": {\n" +
            "      \"model_name\": \"umt5-xxl-enc-fp8_e4m3fn.safetensors\",\n" +
            "      \"precision\": \"bf16\",\n" +
            "      \"load_device\": \"offload_device\",\n" +
            "      \"quantization\": \"disabled\"\n" +
            "    },\n" +
            "    \"class_type\": \"LoadWanVideoT5TextEncoder\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo T5 Text Encoder Loader\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"137\": {\n" +
            "    \"inputs\": {\n" +
            "      \"model\": \"TencentGameMate/chinese-wav2vec2-base\",\n" +
            "      \"base_precision\": \"fp16\",\n" +
            "      \"load_device\": \"main_device\"\n" +
            "    },\n" +
            "    \"class_type\": \"DownloadAndLoadWav2VecModel\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"(Down)load Wav2Vec Model\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"138\": {\n" +
            "    \"inputs\": {\n" +
            "      \"lora\": \"Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors\",\n" +
            "      \"strength\": 0.8000000000000002,\n" +
            "      \"low_mem_load\": false,\n" +
            "      \"merge_loras\": true\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoLoraSelect\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Lora Select\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"159\": {\n" +
            "    \"inputs\": {\n" +
            "      \"start_time\": \"0:00\",\n" +
            "      \"end_time\": \"12\",\n" +
            "      \"audio\": [\n" +
            "        \"125\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"AudioCrop\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"AudioCrop\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"170\": {\n" +
            "    \"inputs\": {\n" +
            "      \"chunk_fade_shape\": \"linear\",\n" +
            "      \"chunk_length\": 12,\n" +
            "      \"chunk_overlap\": 0.1,\n" +
            "      \"audio\": [\n" +
            "        \"159\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"AudioSeparation\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"AudioSeparation\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"171\": {\n" +
            "    \"inputs\": {\n" +
            "      \"width\": [\n" +
            "        \"235\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"height\": [\n" +
            "        \"236\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"upscale_method\": \"lanczos\",\n" +
            "      \"keep_proportion\": \"crop\",\n" +
            "      \"pad_color\": \"0, 0, 0\",\n" +
            "      \"crop_position\": \"center\",\n" +
            "      \"divisible_by\": 2,\n" +
            "      \"device\": \"cpu\",\n" +
            "      \"image\": [\n" +
            "        \"222\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"ImageResizeKJv2\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Resize Image v2\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"173\": {\n" +
            "    \"inputs\": {\n" +
            "      \"clip_name\": \"clip_vision_h.safetensors\"\n" +
            "    },\n" +
            "    \"class_type\": \"CLIPVisionLoader\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Load CLIP Vision\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"192\": {\n" +
            "    \"inputs\": {\n" +
            "      \"width\": 832,\n" +
            "      \"height\": 480,\n" +
            "      \"frame_window_size\": 81,\n" +
            "      \"motion_frame\": 9,\n" +
            "      \"force_offload\": false,\n" +
            "      \"colormatch\": \"disabled\",\n" +
            "      \"tiled_vae\": false,\n" +
            "      \"mode\": \"infinitetalk\",\n" +
            "      \"output_path\": \"\",\n" +
            "      \"vae\": [\n" +
            "        \"129\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"start_image\": [\n" +
            "        \"171\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"clip_embeds\": [\n" +
            "        \"193\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoImageToVideoMultiTalk\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Long I2V Multi/InfiniteTalk\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"193\": {\n" +
            "    \"inputs\": {\n" +
            "      \"strength_1\": 1,\n" +
            "      \"strength_2\": 1,\n" +
            "      \"crop\": \"center\",\n" +
            "      \"combine_embeds\": \"average\",\n" +
            "      \"force_offload\": true,\n" +
            "      \"tiles\": 0,\n" +
            "      \"ratio\": 0.5000000000000001,\n" +
            "      \"clip_vision\": [\n" +
            "        \"173\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"image_1\": [\n" +
            "        \"171\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoClipVisionEncode\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo ClipVision Encode\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"194\": {\n" +
            "    \"inputs\": {\n" +
            "      \"normalize_loudness\": true,\n" +
            "      \"num_frames\": 500,\n" +
            "      \"fps\": 25,\n" +
            "      \"audio_scale\": 1,\n" +
            "      \"audio_cfg_scale\": 1,\n" +
            "      \"multi_audio_type\": \"para\",\n" +
            "      \"wav2vec_model\": [\n" +
            "        \"137\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"audio_1\": [\n" +
            "        \"170\",\n" +
            "        3\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"MultiTalkWav2VecEmbeds\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Multi/InfiniteTalk Wav2vec2 Embeds\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"220\": {\n" +
            "    \"inputs\": {\n" +
            "      \"steps\": 4,\n" +
            "      \"cfg\": 1.0000000000000002,\n" +
            "      \"shift\": 8.000000000000002,\n" +
            "      \"seed\": 936718434218978,\n" +
            "      \"force_offload\": true,\n" +
            "      \"scheduler\": \"flowmatch_distill\",\n" +
            "      \"riflex_freq_index\": 0,\n" +
            "      \"denoise_strength\": 1,\n" +
            "      \"batched_cfg\": false,\n" +
            "      \"rope_function\": \"comfy\",\n" +
            "      \"start_step\": 0,\n" +
            "      \"end_step\": -1,\n" +
            "      \"add_noise_to_samples\": false,\n" +
            "      \"model\": [\n" +
            "        \"122\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"text_embeds\": [\n" +
            "        \"135\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"image_embeds\": [\n" +
            "        \"192\",\n" +
            "        0\n" +
            "      ],\n" +
            "      \"multitalk_embeds\": [\n" +
            "        \"194\",\n" +
            "        0\n" +
            "      ]\n" +
            "    },\n" +
            "    \"class_type\": \"WanVideoSampler\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"WanVideo Sampler\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"222\": {\n" +
            "    \"inputs\": {\n" +
            "      \"video\": \"f3386fcafa5f8a3471c3bbafd3683dd1988d7db44528aba94fd3cb130880ca45.mp4\",\n" +
            "      \"force_rate\": 0,\n" +
            "      \"force_size\": \"Disabled\",\n" +
            "      \"custom_width\": 0,\n" +
            "      \"custom_height\": 0,\n" +
            "      \"frame_load_cap\": 81,\n" +
            "      \"skip_first_frames\": 0,\n" +
            "      \"select_every_nth\": 1,\n" +
            "      \"format\": \"AnimateDiff\"\n" +
            "    },\n" +
            "    \"class_type\": \"VHS_LoadVideo\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"Load Video (Upload) \uD83C\uDFA5\uD83C\uDD65\uD83C\uDD57\uD83C\uDD62\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"235\": {\n" +
            "    \"inputs\": {\n" +
            "      \"value\": 832\n" +
            "    },\n" +
            "    \"class_type\": \"INTConstant\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"width\"\n" +
            "    }\n" +
            "  },\n" +
            "  \"236\": {\n" +
            "    \"inputs\": {\n" +
            "      \"value\": 480\n" +
            "    },\n" +
            "    \"class_type\": \"INTConstant\",\n" +
            "    \"_meta\": {\n" +
            "      \"title\": \"height\"\n" +
            "    }\n" +
            "  }\n" +
            "}";
}
