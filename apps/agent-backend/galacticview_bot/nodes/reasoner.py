from groq import BadRequestError
from loguru import logger

from galacticview_bot.core.state import AgentState
from galacticview_bot.nodes.model import llm
from galacticview_bot.tools.search import tavily_search_tool

tools = [tool for tool in [tavily_search_tool] if tool is not None]
llm_with_tools = llm.bind_tools(tools, tool_choice="auto") if tools else llm

MAX_TOOL_RETRIES = 3
TOOL_TEMPERATURE = 0.3


def _is_tool_use_failed(error: BadRequestError) -> bool:
    body = str(error)
    return "tool_use_failed" in body


def _invoke_with_tool_retry(messages):
    """Invoke the tool-enabled LLM, retrying with lower temperature on Groq tool_use_failed."""
    temperature = TOOL_TEMPERATURE

    for attempt in range(MAX_TOOL_RETRIES):
        try:
            bound_llm = llm_with_tools.bind(temperature=temperature)
            return bound_llm.invoke(messages)
        except BadRequestError as error:
            if not _is_tool_use_failed(error) or attempt == MAX_TOOL_RETRIES - 1:
                raise

            temperature = max(temperature - 0.1, 0.0)
            logger.warning(
                "Groq tool call failed (attempt {}/{}), retrying with temperature {}",
                attempt + 1,
                MAX_TOOL_RETRIES,
                temperature,
            )

    raise RuntimeError("Tool invocation failed after retries")


def reasoner(state: AgentState) -> dict:
    """
    The brain. Decides whether to search or answer.
    """
    logger.info("Entering Reasoner Node")
    messages = state["messages"]

    if tools:
        try:
            response = _invoke_with_tool_retry(messages)
        except BadRequestError as error:
            if _is_tool_use_failed(error):
                logger.warning(
                    "Tool calling failed after retries, answering without search: {}",
                    error,
                )
                response = llm.invoke(messages)
            else:
                raise
    else:
        response = llm_with_tools.invoke(messages)

    return {"messages": [response]}
