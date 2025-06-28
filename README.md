# 🎯 AI-Powered Career Simulation System

An intelligent, interactive web application that helps individuals explore 10-year career paths based on their personality traits, skills, and interests. Powered by AI, decision trees, rule-based logic, and ontologies, this system aims to bring clarity and confidence to career planning.

## 🌟 Vision

The vision is to help individuals make informed career decisions through AI-driven simulations. By mapping out personalized 10-year career paths, the system brings clarity and confidence to career planning, making guidance more accessible and future-ready.

## 🧠 Techniques Used

This system combines multiple intelligent approaches to generate personalized and logical career paths:

1. **Decision Tree Logic** – Guides users through structured career decisions based on their input.  
2. **Gemini API Client (Google's AI)** – For natural language understanding and generating career journey simulations.  
3. **Rule-Based System** – Matches user inputs (skills, traits, preferences) to careers using logical conditions.  
4. **Ontology-Based Matching** – Uses structured knowledge models to connect traits, skills, and careers meaningfully.  

## 🛠️ Tech Stack

### 💻 Frontend
- **Next.js** (React + TypeScript)  
- **Tailwind CSS** for styling  
- **Radix UI & Lucide Icons** for components  
- **Styled JSX** for scoped design  

### 🧠 AI & Logic
- **Gemini API Client** (Google AI)  
- **Decision Trees** for user navigation  
- **Rule-Based Matching** engine  
- **Ontology model** for semantic career connections  

### 📄 Text File Generation
🖨 Provides a Print button to directly print the career simulation 

## 🚀 Features

- 🔍 Collects user input (personality, skills, interests)  
- 🧠 Simulates AI-generated 10-year career journeys  
- ⚖️ Compares multiple career paths for best fit  
- 📄 Outputs a downloadable **.txt file** report of the career simulation  
- 📱 Responsive UI for mobile and desktop  

## 📁 Project Structure

- `components/` – Contains UI components like:  
  - `UserInputForm.tsx` – Handles user input  
  - `CareerMatching.tsx` – Maps input to career paths  
  - `DecisionTree.tsx` – Manages decision tree logic  
  - `ReportDownload.tsx` – Generates and downloads `.txt` report  

- `pages/` – Application routes:  
  - `index.tsx` – Home and input form  
  - `simulation.tsx` – Displays generated results  
  - `compare.tsx` – Career comparison view  

- `public/` – Static files (images, icons)  

- `utils/` – Core logic and integrations:  
  - `geminiClient.ts` – Google Gemini API setup  
  - `promptBuilder.ts` – Formats user data for AI prompt  
  - `ruleEngine.ts` – Applies rule-based logic  
  - `ontologyMap.ts` – Connects traits/skills/careers  

- `styles/` – Global and component-specific styles (Tailwind)  
- `.env.local` – Environment file for API keys  
- `package.json` – Project dependencies and scripts  
- `tsconfig.json` – TypeScript configuration  
- `README.md` – Project documentation  


