# 🤖 GalacticView AI Agent

![Python](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Poetry](https://img.shields.io/badge/Poetry-Package%20Manager-blueviolet?style=for-the-badge&logo=poetry&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-Fast%20Inference-f55036?style=for-the-badge)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Orchestration-1c2c4c?style=for-the-badge)
![Tavily](https://img.shields.io/badge/Tavily-Search%20Tool-000000?style=for-the-badge)

> A specialized AI service powered by **Groq** (Llama 3.1) and **LangGraph**. Designed to answer astronomy-related questions with real-time web search capabilities using **Tavily**.

---

## 📖 Overview

This repository houses the intelligent backend for the [GalacticView](https://github.com/levilevente/GalacticView) ecosystem.

It provides two modes of interaction:
1.  **CLI Tool:** For testing and direct interaction in the terminal.
2.  **REST API Server:** A backend service that exposes the agent to the frontend application.

The core agent logic is encapsulated in the `galacticview_bot` package, leveraging **LangGraph** for reasoning loops and **Groq** for high-speed inference.

### 🛠 Tech Stack

* **Language:** Python
* **Web Framework:** FastAPI (Server)
* **Orchestration:** LangGraph (LangChain)
* **Inference Engine:** Groq API
* **Model:** Llama 3.1 (via Groq)
* **Tools:** Tavily Search API
* **Dependency Management:** Poetry

---

## ⚙️ Prerequisites & Setup

Before running the agent, ensure you have the necessary tools and API keys.

### 1. Install System Tools
* **Python:** Version >=3.12, <3.14
* **Poetry:** [Installation Guide](https://python-poetry.org/docs/#installation).

### 2. Obtain API Keys
* **Groq API Key:** Sign up at [console.groq.com](https://console.groq.com).
* **Tavily API Key:** Sign up at [tavily.com](https://tavily.com).

---

## 🚀 Installation & Configuration

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/levilevente/GalacticView-agent.git
    cd GalacticView-agent
    ```

2.  **Install Python Dependencies**
    Use Poetry to install the environment defined in `pyproject.toml`.
    ```bash
    poetry install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your keys:
    ```bash
    # .env file content
    GROQ_API_KEY=gsk_your_groq_key_here
    TAVILY_API_KEY=tvly-your_tavily_key_here
    MODEL_NAME=llama-3.1-70b-versatile
    LLM_LOCAL=False  # Set to True if using a local Ollama instance
    ```

---

## 💻 Usage

You can run the application in two ways using the scripts defined in `pyproject.toml`.

### Option 1: Run the CLI (Command Line Interface)
Best for testing the agent logic directly in your terminal.
```bash
poetry run galacticview_cli
```

### Option 2: Run the API Server
Starts the web server (located in `server/serve.py`) to accept HTTP requests.
```bash
poetry run galacticview_app
```

## 📡 API Documentation

When running the server (`poetry run galacticview_app`), the agent logic is exposed via a REST endpoint.

`POST /chat`

Receives a user question and returns the structured agent response.

#### Request
```JSON
{
    "question": "How many stars are approximately between earth and moon?",
    "date": "2025-12-01"
}
```

#### Response
```JSON
{
    "title": "Stars and the Moon",
    "content": "There are no stars between Earth and the Moon. The closest star, Proxima Centauri, is over 4 light-years away. This means that the Moon is in the Earth's shadow and does not reflect the light of any nearby stars. The Moon's surface is illuminated by the Sun's light, which is the only star that is close enough to be visible from the Moon.",
    "key_metrics": [
        "4 light-years",
        "Proxima Centauri",
        "Earth's shadow"
    ]
}
```

## 🧠 Agent Logic
Structure (for more details see `agents.py`):

1. Input: The agent receives a query via the CLI or API.

2. Reasoning (LangGraph): The agent determines if it has the internal knowledge to answer or if it needs external information.

3. Tool Usage (Tavily): If the topic requires current events (e.g., "news today"), it calls the Tavily Search API.

4. Synthesis (Groq): The LLM synthesizes the search results into a structured JSON format containing a summary, title, and key metrics.

## 📄 License

This project is licensed under the Apache License 2.0 - see the  [LICENSE](LICENSE)  file for details.