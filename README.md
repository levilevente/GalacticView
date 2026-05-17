# 🌌 GalacticView

![Monorepo](https://img.shields.io/badge/Monorepo-Workspace-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3.12%2B-blue?style=for-the-badge&logo=python&logoColor=white)

> A comprehensive platform for exploring the cosmos, fueled by **NASA Open APIs** and **AI**, designed to bring the universe closer to you.

Welcome to the **GalacticView** monorepo! This repository houses the entire ecosystem for the GalacticView application, organizing all frontend and backend services in one place.

---

## 📖 Overview

GalacticView makes astronomical data accessible and visually stunning. It combines high-quality space imagery and data from NASA with a highly capable AI assistant that can answer complicated questions about the universe.

This repository is structured as a monorepo containing multiple interconnected applications under the `apps/` directory.

---

## 🏗️ Architecture & Apps

### 1. 🖥 Frontend (`apps/frontend`)

A modern, sleek web visualizer built with **React**, **TypeScript**, and **Vite**.

- Fetches and displays real-time astronomical data from NASA APIs (such as APOD, EPIC, and the NASA Image and Video Library).
- Provides the main user interface and chat widget for interacting with the AI agent.
- **[Read the Frontend Setup Guide & README](./apps/frontend/README.md)**

### 2. 🤖 AI Agent Backend (`apps/backend`)

An intelligent service powered by **Groq**, **LangGraph**, and **FastAPI**.

- Exposes a REST API to handle space-related queries from the frontend.
- Uses the **Tavily** search API to supplement the AI's knowledge with real-time astronomy facts.
- **[Read the Agent Backend Setup Guide & README](./apps/backend/README.md)**

---

## 🔮 Future Roadmap

GalacticView is continuously evolving. Our next major step towards becoming a full-stack community platform includes adding user-generated content features:

- [] **Community Platform Backend:** A planned _second_ backend application (technology stack TBD) that will be added to this monorepo. This microservice will be dedicated to managing **User Posts**, allowing community members to publish blogs, leave comments, and share their astronomy experiences directly on GalacticView.

---

## 🚀 Getting Started

To run the full stack locally, you will need to set up both the frontend client and the AI backend service.

### Prerequisites

- **Node.js** (v16+) and **npm/yarn** for the frontend.
- **Python** (v3.12+) and **Poetry** for the agent backend.
- API Keys for **NASA**, **Groq**, and **Tavily**.

### 1. Start the Backend Agent

Navigate to the backend directory, install the Python dependencies using Poetry, and run the FastAPI server:

```bash
cd apps/backend
poetry install

# Be sure to set up your .env file in apps/backend first!
# GROQ_API_KEY=... / TAVILY_API_KEY=...
poetry run galacticview_app
```

### 2. Start the Frontend

In a new terminal window, navigate to the frontend directory, install the Node dependencies, and start the Vite development server:

```bash
cd apps/frontend
npm install

# Be sure to set up your .env file in apps/frontend first!
# VITE_NASA_API_KEY=...
npm run dev
```

---

## 📄 License

This project incorporates multiple applications, each with their respective licenses. Please refer to `apps/frontend/LICENSE` and `apps/backend/LICENSE` for more information.
