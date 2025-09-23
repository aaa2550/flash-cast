from __future__ import annotations
from typing import Dict, Any
from .base import TaskStrategy, StrategyRegistry

try:
    from crewai import Agent, Task, Crew
except ImportError:
    Agent = Task = Crew = None

@StrategyRegistry.register("code")
class CodeStrategy(TaskStrategy):
    def run(self) -> Dict[str, Any]:
        instruction = self.params.get("instruction") or self.params.get("prompt")
        language = self.params.get("language", "python")
        if not instruction:
            return {"error": "missing 'instruction' in params"}
        delay = self.params.get("sleep") or self.params.get("simulate_delay")
        if isinstance(delay, (int, float)) and delay > 0:
            import time; time.sleep(min(delay, 10))

        if Agent is None:
            # stub 代码生成
            code = f"# (stub) Generated {language} code for: {instruction}\nprint('Hello from stub code generator')"
            return {"type": "code", "language": language, "code": code}

        coder = Agent(role="Programmer", goal=f"Write {language} code as requested", backstory="Senior software engineer")
        task = Task(description=f"Write {language} code for: {instruction}", agent=coder, expected_output="Only the code")
        crew = Crew(agents=[coder], tasks=[task])
        result = crew.kickoff()
        return {"type": "code", "language": language, "code": str(result)}
