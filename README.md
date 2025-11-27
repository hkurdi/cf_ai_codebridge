# cf_ai_codebridge

**An AI-powered code translation platform with bilingual voice explanations.**

🌐 **Live Demo**: [codebridge-cf-hlk.netlify.app](https://codebridge-cf-hlk.netlify.app)

---

## 💡 The Problem

Developers constantly context-switch between programming languages—whether learning a new language, migrating legacy code, or collaborating across tech stacks. Understanding not just *what* translates, but *why* and *how* languages differ architecturally, is crucial. Traditional translation tools give you code without context. Documentation is silent. You're left Googling differences or asking ChatGPT in a separate tab.

**CodeBridge solves this**: Translate code between languages and immediately hear a natural voice explanation of what changed and why—in English or Arabic.

---

## 🎯 What It Does

CodeBridge is an intelligent code translator that:

- **Translates code** between 9 programming languages (JavaScript, TypeScript, Python, Java, C++, Go, Rust, Ruby, PHP)
- **Explains architectural differences** between languages in natural language
- **Speaks the explanation aloud** using AI-generated voice (English or Arabic)
- **Maintains conversation context** so you can ask follow-up questions
- **Reads code syntax aloud** converting `std::cout` to "standard c out" for accessibility

It's like having a bilingual programming tutor who can explain code translations on demand.

---

## 🌟 Why I Built This

As an international student and the creator of **Ta5beesScript** (an Arabic programming language with 500+ NPM downloads), I've seen firsthand how language barriers affect learning to code. Programming education is predominantly in English, but understanding happens in your native language.

I wanted to build something that:
1. **Bridges language barriers** in programming education
2. **Makes code translation educational**, not just functional
3. **Leverages Cloudflare's edge infrastructure** to deliver AI at scale
4. **Demonstrates Arabic NLP capabilities** in developer tools

This project combines my passion for accessible education, multilingual tech, and distributed systems.

---

## 🏗️ How It Works

### The Flow
1. **Input**: Paste Python code, select JavaScript as target (for example)
2. **Translation**: Cloudflare Workers AI (Llama 3.3-70B) translates and explains
3. **Speech Generation**: ElevenLabs converts explanation to natural speech
4. **Code-to-Speech**: Backend converts `console.log()` to "console dot log" for audio
5. **Conversational Memory**: Durable Objects maintain context for follow-ups

### The Architecture

**Backend (Cloudflare Workers)**
- **Workers AI**: Llama 3.3-70B for intelligent translation
- **Durable Objects**: Persistent conversation state and memory
- **ElevenLabs API**: High-quality multilingual text-to-speech
- **Edge Computing**: Sub-100ms response times globally

**Frontend (React + TypeScript)**
- **Monaco Editor**: Professional code editing experience
- **Prism.js**: Syntax highlighting in chat
- **Custom Audio Player**: Smooth playback with `requestAnimationFrame`
- **Responsive Design**: Mobile-first with Tailwind CSS

**Key Technical Decisions**:
- Used **Durable Objects** over traditional databases for conversation state—lower latency, no cold starts
- Implemented **bilingual TTS** to differentiate the project and honor my Ta5beesScript background
- Built **code-to-speech converter** so audio reads actual code syntax, improving accessibility
- Chose **Workers AI** over external LLMs for cost efficiency and speed at the edge

---

## 🚀 Tech Stack

**Infrastructure**: Cloudflare Workers, Durable Objects, Workers AI  
**AI Models**: Llama 3.3-70B (translation), ElevenLabs (TTS)  
**Frontend**: React 18, TypeScript, Vite, Tailwind CSS  
**Code Editors**: Monaco Editor, Prism.js  
**Deployment**: Cloudflare Workers (backend), Netlify (frontend)

---

## ✨ What Makes It Different

Most code translators are one-way tools: paste code, get code. CodeBridge is:

1. **Educational**: Explains *why* languages differ, not just *how*
2. **Accessible**: Voice explanations make it useful while coding hands-free
3. **Bilingual**: Supports Arabic explanations (rare in dev tools)
4. **Conversational**: Ask "How does this look in Java?" and get context-aware answers
5. **Edge-Native**: Built entirely on Cloudflare's edge platform

---

## 🎓 What I Learned

Building CodeBridge taught me:
- **Edge computing patterns**: When to use Durable Objects vs. external databases
- **LLM prompt engineering**: Crafting system prompts that generate speakable text
- **Audio processing in browsers**: Base64 encoding, `AudioContext`, smooth playback
- **TypeScript at scale**: Clean architecture with hooks, contexts, and utilities
- **Bilingual UX design**: Making language switching feel natural

Most importantly: AI is most powerful when it makes existing workflows *faster* and *more accessible*, not when it replaces them.

---

## 📊 Impact & Metrics

- **9 languages supported**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, Ruby, PHP
- **2 explanation languages**: English, Arabic
- **Sub-second translation times**: Thanks to Cloudflare's global edge network
- **1000+ lines of clean TypeScript**: Modular, maintainable, well-architected
- **Fully responsive**: Works on mobile, tablet, desktop

---

## 👨‍💻 About Me

I'm **Hamza Kurdi**, a software engineer and MS Computer Science student at USF (August 2025 - May 2027). I previously worked at Sur Consulting, providing engineering services to Tesla, MLB, Hyatt, and Cisco.

I build tools that make programming more accessible:
- **Ta5beesScript**: Arabic programming language (500+ NPM downloads)
- **Misbah**: Mindfulness app with Quranic content (1,000+ organic downloads)
- **Baladi**: Chat platform for international students

**Links**:
- GitHub: [github.com/hkurdi](https://github.com/hkurdi)
- Portfolio: [whoishlk.dev](https://whoishlk.dev)
- LinkedIn: [linkedin.com/in/hamza-kurdi](https://linkedin.com/in/hamza-kurdi)

---

Built for the **Cloudflare Software Engineering Internship** application.

**Built with ❤️ and ☕ by Hamza Kurdi**

*For a complete list of AI prompts used in development, see [`PROMPTS.md`](./PROMPTS.md)*
