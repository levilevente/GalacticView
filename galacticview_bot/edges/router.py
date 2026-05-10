from loguru import logger
from galacticview_bot.core.state import AgentState

def should_continue(state: AgentState) -> str:
    """
    Conditional logic: If tool calls exist, go to tools. Else, format output.
    """
    logger.info("Evaluating should_continue condition")
    messages = state["messages"]
    last_message = messages[-1]

    tool_calls = getattr(last_message, "tool_calls", [])
    
    if not tool_calls:
        return "formatter"
    
    ai_moves = len([m for m in messages if m.type == "ai"])

    if ai_moves >= 5:
        logger.warning("Maximum reasoning steps reached. Forcing format.")
        return "formatter"
    
    return "tools"
