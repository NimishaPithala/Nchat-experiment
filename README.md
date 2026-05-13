# Nchat


**Nchat — AI-Powered Chat Application**

Built a production-ready AI chat web application with a focus on clean UI, real-time streaming responses, and multimodal input support. Deployed end-to-end on cloud infrastructure.

**Key Technical Contributions:**
- Designed and built a responsive React frontend with a premium light-gradient UI, animated message bubbles, slide-in sidebar with chat history, and mobile-first layout using Tailwind CSS
- Developed a Python FastAPI backend that integrates with **AWS Bedrock (Claude 3.5 Sonnet)** for LLM inference, supporting streaming responses with natural word-by-word pacing
- Implemented **multimodal input** — users can upload and send images, PDFs, CSVs, and text files which are base64-encoded and passed to the model alongside text prompts
- Integrated **Supabase** for user authentication (email/password + Google OAuth), session management, and secure user data handling
- Deployed backend as a **Render Web Service** and frontend as a **Render Static Site**, with environment-based configuration for staging and production
- Built a real-time **streaming response system** using FastAPI `StreamingResponse` and browser `ReadableStream` API, with variable delay logic to simulate natural typing rhythm

**Tech Stack:** React 18, Vite, Tailwind CSS, Python 3, FastAPI, AWS Bedrock, boto3, Supabase, Render



## Features
-  Real-time streaming AI responses (word-by-word, natural pacing)
-  Multimodal input — send images, PDFs, CSVs alongside text
-  Authentication via Supabase (email + Google OAuth)
-  Fully mobile-responsive design
-  In-session chat history with sidebar navigation
-  Deployed on Render (backend + frontend)

## Stack
Frontend: React 18, Vite, Tailwind CSS
Backend:  Python, FastAPI, AWS Bedrock (boto3)
Auth:     Supabase
Deploy:   Render
```

