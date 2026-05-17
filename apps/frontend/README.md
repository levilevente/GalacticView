# 🌌 GalacticView

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/React_Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-%3E%3D16-green?style=for-the-badge&logo=node.js)

> A sleek, modern web interface for exploring the cosmos, powered by **NASA's Open APIs**.

---

## 📖 Overview

**GalacticView** is a web application designed to make astronomical data accessible and visually stunning. Built with **React** and **TypeScript**, it fetches real-time data from NASA to render high-quality space imagery and information in a user-friendly dashboard.

While currently a frontend visualization tool, the project has an ambitious roadmap to evolve into a full-stack community platform with AI integration.

### 🛠 Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Styling:** React Bootstrap
- **Data Source:** NASA Open APIs

---

## 🚀 Features & Roadmap

### ✅ Current Features

- **NASA Data Integration:** Seamless fetching and display of astronomical data (APOD, etc.).
- **Modern UI:** A responsive and clean interface built with React Bootstrap.
- **Type Safety:** Robust codebase using TypeScript.

### 🔮 Future Roadmap

I am actively working on expanding GalacticView into a comprehensive platform:

- [ ] **Backend Service:** Developing a dedicated backend to handle user blogposts, comments, review on space experiences.
- [ ] **Community Content:** Adding support for **User Blogs** and **Reviews**.
- [x] **AI Assistant:** Integration of an AI-powered bot to answer space-related questions (e.g., "What is a nebula?").
    > 🤖 **Note:** The source code for the AI Assistant service is hosted separately at **[galacticview-agent](https://github.com/levilevente/galacticview-agent)**.

---

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js:** Version 16 or higher.
- **Package Manager:** Yarn or npm.
- **Recommended Editor:** WebStorm (macOS).

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/levilevente/GalacticView.git
    cd GalacticView
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    - Obtain a free API Key from [api.nasa.gov](https://api.nasa.gov/).
    - Create a `.env` file in the root directory.
    - Add your key:
        ```env
        VITE_NASA_API_KEY=your_key_here
        ```

4.  **Run the Application**
    ```bash
    npm start
    # or
    yarn start
    ```

---

## 📸 Screenshots

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/8d218c1a-f26d-4d6f-b6ff-1ce82a64e843" alt="Screen 1" />
  <br />
  <img width="800" src="https://github.com/user-attachments/assets/378663fe-4775-422f-a3a3-f075f0490ea9" alt="Screen 2" />
  <br />
  <img width="800" src="https://github.com/user-attachments/assets/25893b35-7545-4791-8095-dfed9abf1bcf" alt="Screen 3" />
  <br />
  <img width="800" src="https://github.com/user-attachments/assets/17b1de17-e134-47d9-8b50-60f9a8b2d83a" alt="Screen 4" />
</p>

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
