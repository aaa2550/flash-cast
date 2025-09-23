from __future__ import annotations
from typing import Dict, Any, List
from .base import TaskStrategy, StrategyRegistry

try:
    from crewai import Agent, Task, Crew
except ImportError:
    Agent = Task = Crew = None

@StrategyRegistry.register("summarize")
class SummarizeStrategy(TaskStrategy):
    def run(self) -> Dict[str, Any]:
        texts: List[str] = self.params.get("texts") or []
        if not texts:
            return {"error": "missing 'texts' list in params"}
        delay = self.params.get("sleep") or self.params.get("simulate_delay")
        if isinstance(delay, (int, float)) and delay > 0:
            import time; time.sleep(min(delay, 10))

        if Agent is None:
            merged = " ".join(texts)
            summary = merged[:300] + ("..." if len(merged) > 300 else "")
            return {"type": "summarize", "summary": summary, "count": len(texts)}

        summarizer = Agent(role="Summarizer", goal="Summarize given content", backstory="Expert technical writer")
        content = "\n".join(texts)
        task = Task(description=f"Summarize the following content:\n{content}\nReturn concise bullet points.", agent=summarizer)
        crew = Crew(agents=[summarizer], tasks=[task])
        result = crew.kickoff()
        return {"type": "summarize", "summary": str(result), "count": len(texts)}
