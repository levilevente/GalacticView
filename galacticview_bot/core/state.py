from typing import Annotated, TypedDict
from langgraph.graph import add_messages


class AgentState(TypedDict):
  messages: Annotated[list, add_messages]
  llm_calls: int