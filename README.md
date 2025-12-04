<p align="center"> 
  <img src="assets/screenshots/icon.png" alt="icon" width="250"/> 
</p>

<h1 align="center">Swipeat</h1>

<p align="center">
Swipeat is a simple and efficient meal tracking <strong>AI Powered</strong> <strong>cross-platform</strong> app.  
Add meals once, then swipe daily to log them — fast, easy, and consistent.  
(AVAILABLE ON ANDROID 👉 <a href="https://apkpure.com/p/com.annous246.react_native_app">DOWNLOAD (old version)</a>)
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

## 🛢️ Databse Class Diagram

```mermaid
classDiagram
    %% =======================
    %%        USERS
    %% =======================
    class Users {
        +int id PK
        +string email
        +string password
        +string username
        +float protein_progress
        +float carbs_progress
        +float calories_progress
        +float height
        +float weight
        +int age
        +boolean stepper
        +timestamp last_reset
        +boolean gender
        +boolean verified
        +string code
        +timestamp code_date
    }

    %% =======================
    %%        FOODS
    %% =======================
    class Foods {
        +int id PK
        +string name
        +float protein
        +float carbs
        +float calories
        +float portion
        +int userid FK -> Users.id
    }

    %% =======================
    %%   CONSUMED FOODS TODAY
    %% =======================
    class ConsumedFoods {
        +string name
        +float protein
        +float carbs
        +float calories
        +float portion
        +int userid FK -> Users.id
        +int servings
        +int id FK -> Foods.id
    }

    %% =======================
    %%   PAST CONSUMED FOODS
    %% =======================
    class PastConsumedFoods {
        +int id PK
        +string name
        +float protein
        +float carbs
        +float calories
        +float portion
        +int userid FK -> Users.id
        +date consumed_date
        +int servings
    }

    %% =======================
    %%     MACRO GOALS NOW
    %% =======================
    class MacroGoals {
        +float protein_goal
        +float carbs_goal
        +float calories_goal
        +int userid FK -> Users.id
    }

    %% =======================
    %%    PAST MACRO PROGRESS
    %% =======================
    class PastMacroProgress {
        +float protein_goal
        +float carbs_goal
        +float calories_goal
        +int userid FK -> Users.id
        +date progress_date
    }

    %% =======================
    %%      RELATIONSHIPS
    %% =======================

    Users "1" --> "many" Foods : owns >
    Users "1" --> "many" ConsumedFoods : logs >
    Users "1" --> "many" PastConsumedFoods : logged >
    Users "1" --> "1" MacroGoals : has >
    Users "1" --> "many" PastMacroProgress : history >

    Foods "1" --> "many" ConsumedFoods : referenced by >
```

## 🧠 AI Food Recognition System Architecture
```mermaid
flowchart LR
    A["Mobile App (Expo React Native)"] --> B["Node.js Backend API"]

    subgraph Backend ["Node.js Backend Server"]
        direction TB
        B --> C["GPT-4 (Tool Calling): Image Recognition + Food Detection"]
        C --> E["Response Builder: Combine food name + macros + portion"]
    end

    E --> F["Return JSON Response to Frontend"]
    F --> G["Display Food Info: Name, Calories, Protein, Carbs, Fat"]
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
  <img src="assets/screenshots/1.jpg" alt="Screenshot 1" height="400"/>
  <img src="assets/screenshots/2.jpg" alt="Screenshot 2" height="400"/>
  <img src="assets/screenshots/3.png" alt="Screenshot 3" height="400"/>
  <img src="assets/screenshots/4.jpg" alt="Screenshot 4" height="400"/>
  <img src="assets/screenshots/5.jpg" alt="Screenshot 5" height="400"/>
  <img src="assets/screenshots/6.jpg" alt="Screenshot 6" height="400"/>
  <img src="assets/screenshots/7.png" alt="Screenshot 7" height="400"/>
  <img src="assets/screenshots/8.jpg" alt="Screenshot 8" height="400"/>
  <img src="assets/screenshots/9.jpg" alt="Screenshot 9" height="400"/>
  <img src="assets/screenshots/10.jpg" alt="Screenshot 10" height="400"/>
  <img src="assets/screenshots/11.jpg" alt="Screenshot 11" height="400"/>
  <img src="assets/screenshots/12.jpg" alt="Screenshot 12" height="400"/>
  <img src="assets/screenshots/13.jpg" alt="Screenshot 13" height="400"/>
  <img src="assets/screenshots/14.jpg" alt="Screenshot 14" height="400"/>
  <img src="assets/screenshots/15.jpg" alt="Screenshot 15" height="400"/>
  <img src="assets/screenshots/16.jpg" alt="Screenshot 16" height="400"/>
  <img src="assets/screenshots/17.jpg" alt="Screenshot 17" height="400"/>
  <img src="assets/screenshots/18.jpg" alt="Screenshot 18" height="400"/>
  <img src="assets/screenshots/19.jpg" alt="Screenshot 19" height="400"/>


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
