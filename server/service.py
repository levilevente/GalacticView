from galacticview_bot import app, sys_msg
from .dto import ChatTypeIn, ChatTypeOut

from loguru import logger

from langchain_core.messages import HumanMessage

import json

def chat_ask_question(chat_input: ChatTypeIn) -> ChatTypeOut:
    """
    Function to ask a question to the agent and get a response.
    """
    logger.info("Preparing to process chat question")
    question = chat_input.question

    inputs = {"messages": [sys_msg, HumanMessage(content=question)]}

    try:
        # Hardcoded to a single thread ID to maintain context across all requests for initial testing.
        thread_id = "initial-single-context-thread"

        config = {
            "configurable": {"thread_id": thread_id},
            "recursion_limit": 50
        }

        for event in app.stream(inputs, config=config):  # type: ignore
            for key, value in event.items():
                logger.info(f"LangGraph node triggered: {key}")
                if key == "formatter":
                    json_str = value["messages"][0].content
                    logger.debug("Formatter node output received, parsing JSON.")
                    try:
                        response_data = ChatTypeOut(**json.loads(json_str))
                        logger.success("Successfully parsed JSON into ChatTypeOut schema")
                        return response_data
                    except json.JSONDecodeError:
                        logger.error("JSONDecodeError on formatter payload")
                        return ChatTypeOut(title="Error", content="Malformed JSON received from formatter node.", key_metrics=[])
                    
    except Exception as e:
        logger.exception(f"Error occurred while processing the chat question. More details: {e}")
        return ChatTypeOut(title="Error", content="Error occurred while processing the request.", key_metrics=[])  
    
    return ChatTypeOut(title="Error", content="No response generated from the agent.", key_metrics=[])

