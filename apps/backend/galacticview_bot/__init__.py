from .agents import app as app
from .system_messages import sys_msg as sys_msg

import os
import sys
from dotenv import load_dotenv
from loguru import logger

def setup_logging() -> None:
    """
    Configures the global Loguru logger based on environment variables.
    """
    load_dotenv()
    
    log_level = os.getenv("LOGGING_LEVEL", "INFO").upper()

    try:
        logger.remove()
    except ValueError:
        # Ignore if there are no handlers to remove; this is expected on first setup.
        pass
    
    logger.add(
        sink=sys.stdout, 
        level=log_level,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    )

setup_logging()