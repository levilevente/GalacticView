import json
from loguru import logger
from langchain_core.messages import ToolMessage
from galacticview_bot.core.state import AgentState
from galacticview_bot.tools.search import tavily_search_tool

tools = [tool for tool in [tavily_search_tool] if tool is not None]

def custom_tool_node(state: AgentState) -> dict:
    """
    A tool node that executes the requested tool calls.
    """
    logger.info("Entering Custom Tool Node")
    message = state["messages"]
    last_message = message[-1]

    tool_calls = getattr(last_message, "tool_calls", [])
    
    if not tool_calls:
        return {"messages": []}
    
    tool_map = {tool.name: tool for tool in tools}

    results = []

    for tool_call in tool_calls:
        tool_name = tool_call['name']
        tool_args = tool_call['args']
        tool_call_id = tool_call['id']

        logger.info(f"Executing Custom Tool: {tool_name} with args: {tool_args}")

        if tool_name in tool_map:
            try:
                chosen_tool = tool_map[tool_name]

                raw_output = chosen_tool.invoke(tool_args)

                if not raw_output:
                    logger.warning(f"Tool returned EMPTY result for query: {tool_args.get('query')}")
                    clean_content = "Search returned no results. Try a broader query without filters."
                else:
                    logger.info(f"Tool returned data (Length: {len(str(raw_output))})")
                    clean_content = json.dumps(raw_output) if isinstance(raw_output, (dict, list)) else str(raw_output) 
            except Exception as e:
                logger.exception(f"Error executing tool {tool_name}")
                clean_content = f"Error executing tool {tool_name}: {e}"
        else:
            logger.error(f"Tool {tool_name} not found.")
            clean_content = f"Error: Tool {tool_name} not found."
        
        results.append(ToolMessage(
            tool_call_id=tool_call_id,
            content=str(clean_content),
            name=tool_name
        ))

    return {"messages": results}
