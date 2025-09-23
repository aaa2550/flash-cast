from __future__ import annotations
from typing import Dict, Any, List
from .base import TaskStrategy, StrategyRegistry
from crewai import Agent, Task, Crew

try:
    from core.llm_model_factory import LLMModelFactory
except Exception:
    LLMModelFactory = None  # type: ignore

@StrategyRegistry.register("rewrite")
class RewriteStrategy(TaskStrategy):
    """文案改写策略
    params:
      - text: 必填，待改写原文
      - styles: 可选 list，如 ["简洁", "专业", "营销"]
      - tone: 可选，整体语气，如 "friendly" / "serious"
      - extra_instructions: 额外指令
    输出： { 'original': ..., 'rewrites': [ {style, content}, ... ] }
    crewai 存在时：使用多个 Agent 并行（顺序执行）改写；否则使用 stub 生成。
    """

    def run(self) -> Dict[str, Any]:
        original = self.params.get("text")
        if not original:
            return {"error": "missing 'text'"}

        styles: List[str] = self.params.get("styles") or ["专业"]
        tone = self.params.get("tone")
        extra = self.params.get("extra_instructions")

        # 获取自定义 LLM（如果 crewai 与 LLMModelFactory 都可用）
        llm_obj = LLMModelFactory.create_llm('bailian-qwen-plus')
        agents: List[Agent] = []
        tasks: List[Task] = []
        # 先解析模型名称（用于结果标注）
        model_name = None

        for style in styles:
            role = f"{style}文案改写Agent"
            goal = f"将输入文案改写为风格: {style}"
            backstory = f"一名擅长用 {style} 风格重新表达文案的资深编辑。"
            if tone:
                goal += f"，整体语气倾向 {tone}"
            if extra:
                goal += f"。附加要求: {extra}"
            if model_name:
                goal += f" (使用模型: {model_name})"
            # 直接把 llm 对象注入 Agent 构造（如果可用）
            agent_kwargs: Dict[str, Any] = {
                'role': role,
                'goal': goal,
                'backstory': backstory,
            }
            if llm_obj and not isinstance(llm_obj, dict):
                # crewai 的 Agent 普通签名: Agent(role=..., goal=..., backstory=..., llm=LLM)
                agent_kwargs['llm'] = llm_obj
            agent = Agent(**agent_kwargs)
            agents.append(agent)
            task_desc = (
                f"请将以下原文改写为 {style} 风格：\n---\n{original}\n---\n"
                "要求：语义保持一致，避免重复原句结构，保证流畅自然。"
                "注意：要过滤掉格式和奇怪的文案。"
            )
            tasks.append(Task(description=task_desc, agent=agent, expected_output="仅输出改写后的正文"))

        crew = Crew(agents=agents, tasks=tasks)
        results = crew.kickoff()
        # crewai 的返回结果具体结构可能为字符串或列表，进行兼容处理
        rewrites: List[Dict[str, str]] = []
        if isinstance(results, list):
            for style, content in zip(styles, results):
                rewrites.append({"style": style, "content": str(content)})
        else:
            # 如果是单个字符串则均分不合理，这里直接作为全部风格统一输出
            for style in styles:
                rewrites.append({"style": style, "content": str(results)})

        return {"original": original, "rewrites": rewrites}
