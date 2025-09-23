from __future__ import annotations
from typing import Dict, Any
from .base import TaskStrategy, StrategyRegistry

try:
    from crewai import Agent, Task, Crew
except ImportError:  # 允许在未安装时用简单逻辑替代
    Agent = Task = Crew = None

@StrategyRegistry.register("research")
class ResearchStrategy(TaskStrategy):
    def run(self) -> Dict[str, Any]:
        topic = self.params.get("topic") or self.params.get("query")
        if not topic:
            return {"error": "missing 'topic' in params"}
        delay = self.params.get("sleep") or self.params.get("simulate_delay")
        if isinstance(delay, (int, float)) and delay > 0:
            import time; time.sleep(min(delay, 10))

        # 如果有 crewai，就构建一个简单 agent；否则返回 stub
        if Agent is None:
            return {"type": "research", "topic": topic, "summary": f"(stub) Research summary about {topic}"}
        # crewai 实际执行示例（简单示范）
        researcher = Agent(role="Researcher", goal=f"Collect information about {topic}", backstory="An expert analyst.")
        task = Task(description=f"Research and give a concise summary about: {topic}", agent=researcher, expected_output="A concise bullet summary")
        crew = Crew(agents=[researcher], tasks=[task])
        result = crew.kickoff()
        return {"type": "research", "topic": topic, "summary": str(result)}
