import os
from dotenv import load_dotenv

from langchain_tavily import TavilySearch
from pydantic import BaseModel, Field
from loguru import logger

load_dotenv()

class TavilyInput(BaseModel):
    query: str = Field(description="The search query to find information on the internet.")

if os.getenv("TAVILY_API_KEY"):
    logger.info("TAVILY_API_KEY found. Initializing Tavily search tool.")
    tavily_search_tool = TavilySearch(
        max_results=3,
        include_answer=True,
        include_raw_content=False,
        args_schema=TavilyInput,
        name="tavily_search",
        description="Search the internet for real-time information. Input should be a simple search query string."
    )
else:
    logger.warning("TAVILY_API_KEY not set. Tavily search tool will be disabled.")