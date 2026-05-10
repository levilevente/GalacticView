from loguru import logger
from galacticview_bot.core.state import AgentState
from galacticview_bot.nodes.model import llm
from galacticview_bot.tools.search import tavily_search_tool

tools = [tool for tool in [tavily_search_tool] if tool is not None]
llm_with_tools = llm.bind_tools(tools, tool_choice="auto") if tools else llm

def reasoner(state: AgentState) -> dict:
    """
    The brain. Decides whether to search or answer.
    """
    logger.info("Entering Reasoner Node")
    messages = state["messages"]

    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}
