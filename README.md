<p align="center"> 
  <img src="assets/screenshots/icon.png" alt="icon" width="250"/> 
</p>

<h1 align="center">Swipeat</h1>

<p align="center">
Swipeat is a simple and efficient meal tracking <strong>AI Powered</strong> <strong>cross-platform</strong> app.  
Add meals once, then swipe daily to log them — fast, easy, and consistent.  
(AVAILABLE ON ANDROID 👉 <a href="https://apkpure.com/p/com.annous246.react_native_app">DOWNLOAD</a>)
</p>

---

## 🧩 Tech Badges

### Frontend
![React Native](https://img.shields.io/badge/-React_Native-05122A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

### Backend
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Mongoose](https://img.shields.io/badge/Mongoose-%23323330.svg?style=for-the-badge&logo=mongoose&logoColor=890000)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

### AI & Assistant
![Azure AI](https://img.shields.io/badge/Azure%20AI-Inference-blue?logo=microsoftazure&style=for-the-badge)
![Gemini Flash Lite](https://img.shields.io/badge/Gemini_Flash_Lite-4285F4?style=for-the-badge&logo=google)
![ChromaDB](https://img.shields.io/badge/ChromaDB-282C34?style=for-the-badge&logo=chromadb)
![GitHub Models](https://img.shields.io/badge/GitHub%20Models-gpt--4.1-black?logo=github&style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1-412991?logo=openai&style=for-the-badge)

(soon on [![Google Play Store](https://img.shields.io/badge/Google_Play-414141?logo=google-play&logoColor=white)](#))

---

## ✨ Features

- 🥗 **Instant Add Cam** — use your camera to instantly add meals to your macros.
- 🔎 **Smart Sorting & Search** — find meals and nutrition data instantly.
- 🤖 **Gemini Flash Lite Assistant** — embedded AI chat assistant that:
  - Uses **ChromaDB** for predefined knowledge and contextual answers.
  - If confidence > 60% → responds using **ChromaDB**.
  - If confidence < 30% → switches to **Chatbot Mode** (safe, rail-guarded, roleplaying assistant).
  - Between 30–60% → **Gemini Agent** dynamically decides which mode to use.
- 📊 **Macro Analytics** — visualize calories, protein, carbs, and fats.
- ⚡ **Swipe Logging System** — log your meals with a single swipe.
- 📱 **Cross-Platform App** — Android (available), iOS (coming soon).
- 💡 **AI Recommendations** — get personalized meal suggestions and tracking help.
- 🎨 **Minimal UI** — clean design built with React Native + Expo.

---


## 🧠 AI System Architecture
```mermaid
flowchart LR
    A[Backend Main Server] --> B[Splits PDF into Chunks]
    B --> C[Flask AI Server]

    subgraph FlaskServer [Flask AI Server - Parallel Processing]
        direction TB
        C --> D[Qwen3-Next-80B-A3B-Instruct\nDocument Summarization]
        C --> E[ChromaDB\nExtract Top 3 Categories]
    end

    D --> F[Combined Response\nSummary + Categories]
    E --> F
    F --> G[Backend Main Server]
    G --> H[GPT-4.1 Model\nGenerates MCQ Quiz]
```


## 🧠 AI Chatbot System Architecture


```mermaid
flowchart LR
    A[User Query] --> B[ChromaDB Predefined Response Semantic Search]
    B --> C{Confidence Score}
    C -->|> 60%| D[ChromaDB Response]
    C -->|< 30%| E[Chatbot Mode - Gemini Roleplay]
    C -->|30–60%| F[Gemini reAt agent judge Decides Best choice]
    F --> D
    F --> E

```


## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go app](https://expo.dev/go?sdkVersion=52&platform=android&device=true)

### Installation

```bash
# Clone the repository
git clone https://github.com/username/swipeat.git

# Navigate into the project
cd swipeat

# Install dependencies
npm install
npx expo start --lan
```
## 📱 Screenshots
<p align="center"> 
 <img src="assets/screenshots/main.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/sign.png" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/login.png" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/protein.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/carbs.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/calories.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/adder.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/home.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/swipe.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/consumed.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/short analytics.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/long analytics.png" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/profile.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/settings.jpg" alt="Home Screen" height="400"/> 
<img src="assets/screenshots/tos.jpg" alt="Home Screen" height="400"/> 

</p>


## 🛠️ Tech Stack

React Native + Expo

Node.js + Express

PostgreSQL + Mongoose

OpenAI + Gemini Flash Lite + ChromaDB

JWT Auth + Secure Role Management

## 🤝 Contributing

This is a private project, but feel free to fork it or suggest improvements.

## 📄 License

This project is licensed under the MIT License.
See the LICENSE
 file for details.


---
