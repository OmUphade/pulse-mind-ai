# PulseMind AI

> **A Sequential Multi-Agent System Orchestration Engine**
> 
> Transforming raw product concepts into securely audited technical stack topologies and UX blueprints using cooperative Gemini agents. Built for the Google Gemini Hackathon.

---

## 🎨 Title Card & Telemetry
![PulseMind AI Title Card](file:///C:/Users/OM%20KONDAJI%20UPHADE/.gemini/antigravity/brain/22b7b1d9-6d48-4b80-8313-99707eecce9c/pulsemind_video_banner_1779307641613.png)

---

## 💡 Inspiration
When developers ask standard, single-prompt AI models to generate software architectures, they typically receive a basic, unvetted block of code. In real-world software engineering, a successful application requires sequential planning: a structured database design, a critical security threat audit, and a user interface designed specifically to mitigate those security threats. 

**PulseMind AI** bridges this gap. Moving away from traditional flat chatbots, PulseMind AI acts like an elite engineering team: breaking down complex ideas, analyzing vulnerabilities under adversarial pressure, and automatically designing protective user interfaces.

---

## 🚀 Core Features
1. **Tech Architect Agent**: Ingests raw concepts, defines optimal cloud stack layers (databases, servers, frameworks), and generates enterprise-grade structural topologies.
2. **Security Adversary Agent**: Acts as an offensive cyber auditor, evaluating proposed architectures for direct vulnerabilities (e.g., IDOR, SQL injection, webhook spoofing) and mapping security risk levels.
3. **UI/UX Copilot Agent**: Ingests stack specifications and vulnerability data to design viewport patterns and client-side components specifically engineered to neutralize identified threats.
4. **Resilient Uptime Fallback Engine**: A robust localized mock-generation layer in the backend. If external Gemini API rate limits or quota boundaries ($429$) are encountered, the engine dynamically generates realistic system blueprints to ensure $100\%$ platform uptime.

---

## 🛠️ Technology Stack
* **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
* **Backend**: Node.js, Express, Cors
* **AI Integration**: Google Gemini API, `@google/genai` Node SDK
* **Automation & Tools**: Puppeteer Core, Puppeteer Screen Recorder, FFmpeg Installer

---

## 🏗️ Under the Hood
PulseMind AI utilizes **Sequential Agentic Chaining** to pass structured contexts between specialized Gemini models. Each agent is enforced by strict JSON Schemas (`responseSchema`) to output reliable, type-safe API formats.

```
[User Idea] ➔ [Tech Architect] ➔ [Security Adversary] ➔ [UI/UX Copilot] ➔ [Structured Telemetry Dashboard]
                      │                     │                   │
                      └─────────────┬───────┴───────────────────┘
                             (API Fallback Buffer)
```

---

## 📦 Installation & Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher)
* **Google Chrome** or **Microsoft Edge** (for running automated recordings)

### Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/OmUphade/pulse-mind-ai.git
   cd pulse-mind-ai
   ```

2. **Configure Environment Variables**:
   Create a `.env` file under the `/server` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Install Server Dependencies & Start**:
   ```bash
   cd server
   npm install
   node server.js
   ```

4. **Install Client Dependencies & Start**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

5. Open your browser and navigate to **`http://localhost:5173/`** to explore the dashboard.

---

## 🎥 Pitch Presentation Video
A pitch-perfect automated demonstration video matching the hackathon timeline is available at:
* **Demo Video**: [client/public/pulsemind_demo.mp4](client/public/pulsemind_demo.mp4) (Pushed to Github `main` branch).
* **Presentation Script & Storyboard**: Review [hackathon_video_blueprint.md](file:///C:/Users/OM%20KONDAJI%20UPHADE/.gemini/antigravity/brain/22b7b1d9-6d48-4b80-8313-99707eecce9c/hackathon_video_blueprint.md) to layout your voiceover.
