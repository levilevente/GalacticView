import json
from loguru import logger
from langchain_core.messages import SystemMessage, HumanMessage
from galacticview_bot.core.state import AgentState
from galacticview_bot.nodes.model import llm
from galacticview_bot.response_structure import SpaceResponseStructure

def formatter(state: AgentState) -> dict:
    """
    Takes the final raw text conversation and forces it into the JSON schema.
    """
    logger.info("Entering Formatter Node")
    messages = state["messages"]
    
    formatter_prompt = [
        SystemMessage(content="You are a data extractor. Convert the conversation history into the specific JSON schema provided."),
        messages[-1]
    ]
    
    schema_constrained_llm = llm.with_structured_output(SpaceResponseStructure.model_json_schema())
    response = schema_constrained_llm.invoke(formatter_prompt)
    
    return {"messages": [HumanMessage(content=json.dumps(response))]}
