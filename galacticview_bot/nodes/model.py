from typing import TypedDict

from dotenv import load_dotenv
import os

from langchain_core.messages import BaseMessage
from langchain_groq import ChatGroq
from langchain_core.language_models import BaseChatModel 

from loguru import logger

from galacticview_bot.core.state import AgentState


load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    api_key=os.getenv("GROQ_API_KEY"),
    max_tokens=1024,   
)

class AgentStateUpdate(TypedDict):
    messages: list[BaseMessage]
    llm_calls: int


def llm_call(state: AgentState) -> AgentStateUpdate:
    """Run one LLM turn and return a partial state update.

    This node does not mutate the incoming state. LangGraph merges this return value
    into the global state, and the `add_messages` reducer appends the new message.
    """
    response = llm.invoke(state["messages"])
    logger.info("LLM Called")
    return {
        "messages": [response],
        "llm_calls": state.get("llm_calls", 0) + 1,
    }
