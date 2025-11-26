# PROMPTS.md

**AI-Assisted Problem Solving for CodeBridge**

This document shows how I used LLMs (Claude 3.5 Sonnet) strategically for architectural decisions, performance optimization, and solving complex problems during development. These aren't "write my code" prompts—they're "help me think through this" conversations.

---

## 🏗️ Architecture & Design Decisions

### State Management Strategy
```
I'm building a code translation app with follow-up conversations. I'm debating between:
1. Storing conversation state in Durable Objects
2. Using an external database (PostgreSQL/Redis)
3. Keeping everything stateless and sending full context each time

Considerations:
- Users will have short sessions (5-10 translations max)
- Need low latency globally
- Want to minimize costs
- Cloudflare Workers is my platform

What are the trade-offs? When does Durable Objects make sense over a traditional database?
```

**Why this prompt**: Understanding distributed state patterns and edge computing trade-offs.

---

### Audio Playback Architecture
```
I need to play AI-generated audio in the browser. I'm considering:
1. Auto-playing each response immediately
2. A play/pause button on each message
3. Only allowing one audio to play at a time globally

The audio is base64-encoded MP3 from an API. Users might:
- Ask multiple follow-up questions quickly
- Want to replay explanations
- Use mobile devices

What's the best UX pattern for this? How would you handle the state management for audio across multiple components?
```

**Why this prompt**: Thinking through UX implications and state patterns before coding.

---

### Prompt Engineering for Code Translation
```
I'm prompting Llama 3.3 to translate code and explain differences. Current issues:
- It's too verbose (full paragraphs when I need concise points)
- It uses markdown formatting that sounds weird when read aloud by TTS
- Sometimes skips code blocks and just describes the code

The output goes to both:
1. Visual display (markdown is fine)
2. Text-to-speech (markdown syntax sounds terrible)

How should I structure the system prompt? Should I generate two separate outputs (visual + audio) or post-process a single output?
```

**Why this prompt**: Solving the dual-output problem elegantly without doubling API calls.

---

## ⚡ Performance Optimization

### Base64 Audio Conversion Bottleneck
```
I'm converting large base64 audio strings to playable audio in the browser:

const bytes = new Uint8Array(audioBuffer);
const base64 = btoa(String.fromCharCode(...bytes));

This hits "Maximum call stack size exceeded" on large audio files (30s+). The spread operator can't handle large arrays.

What's the best way to convert large ArrayBuffers to base64 in both:
1. Cloudflare Workers (no Node.js Buffer)
2. Browser context

I need it to be performant and not block the main thread.
```

**Why this prompt**: Found the chunking pattern that solved the stack overflow without external libraries.

---

### Smooth Audio Progress Bar
```
I'm using `audio.addEventListener('timeupdate')` to update my progress bar, but it's choppy—updates only happen every ~250ms.

Requirements:
- 60fps smooth progress (16.67ms updates)
- No excessive re-renders in React
- Accurate current time tracking

Should I use requestAnimationFrame? How do I prevent React from thrashing with state updates every 16ms?
```

**Why this prompt**: Learning the rAF pattern for smooth animations in React without performance issues.

---

## 🎨 UX Problem Solving

### Code-to-Speech Conversion
```
When TTS reads code aloud, it literally says "standard colon colon cout" instead of "standard c out".

I need to convert code syntax to natural speech:
- `std::cout` → "standard c out"
- `<<` → "left shift"
- `console.log()` → "console dot log open paren close paren"

Should I:
1. Use a syntax parser (tree-sitter?)
2. Regex replacements (fast but fragile?)
3. Let the LLM describe the code in words?

The code could be in 9 different languages. What's the most maintainable approach?
```

**Why this prompt**: Balancing complexity vs maintainability for a unique feature.

---

### Mobile-First Responsive Design
```
My Monaco code editor looks great on desktop but breaks on mobile:
- Touch gestures conflict with scrolling
- Font too small
- Takes up full viewport height (can't see explanation below)

I'm using Tailwind. What's the best responsive pattern for a code editor in a mobile-first design? Should I:
1. Use a different component on mobile (textarea?)
2. Adjust Monaco settings for touch
3. Change the layout entirely on small screens
```

**Why this prompt**: Understanding mobile UX patterns for developer tools.

---

## 🧠 Problem-Solving Discussions

### Bilingual System Prompts
```
I want to support both English and Arabic explanations. Challenges:
1. Arabic is RTL but code is LTR
2. Need different TTS voices for each language
3. System prompts need to be in the target language

Should I:
- Maintain two separate prompt templates?
- Use a translation layer?
- Have the LLM respond in requested language via prompt instruction?

I need this to be maintainable as I add more languages later.
```

**Why this prompt**: Planning for extensibility and i18n from the start.

---

### Handling LLM Inconsistency
```
Llama 3.3 sometimes returns:
1. Code + explanation (what I want)
2. Just explanation, no code
3. Code with explanation inside code block (breaks parsing)

My current regex: `/```[\w]*\n([\s\S]*?)```/`

How do I make the LLM output more consistent? Should I:
- Improve prompt engineering?
- Add validation and retry logic?
- Use structured output format (JSON)?
```

**Why this prompt**: Dealing with LLM non-determinism in production.

---

### Prism.js Dependency Hell
```
Getting errors: "Cannot read properties of undefined (reading 'tokenizePlaceholders')"

Prism components have dependencies:
- PHP needs 'markup-templating'
- C++ needs 'c' and 'clike'
- Import order matters

What's the cleanest way to manage Prism language dependencies? Do I need a dynamic import system or can I statically import in the right order?
```

**Why this prompt**: Understanding library internals to fix cryptic errors.

---

### API Response Structure
```
My API currently returns everything in one string:
```javascript
code + explanation
```

Frontend parses with regex. But I'm thinking:
```json
{
  "code": "...",
  "explanation": "...",
  "audio": "..."
}
```

Pros/cons of each approach? Which scales better if I add features like:
- Multiple code examples
- Step-by-step breakdown
- Comparison tables
```

**Why this prompt**: Planning API evolution and data structure.

---

## 💡 How I Used LLMs Effectively

**Strategic Questions**: Architecture decisions, performance patterns, UX considerations  
**Not Used For**: Writing boilerplate, fixing syntax errors, basic debugging

**Pattern**: Always started with "What are the trade-offs?" not "Write the code"

**Follow-ups**: When given a solution, I asked "Why this approach over alternatives?"

**Validation**: Tested suggestions, sometimes found issues, asked "This failed because X, why?"

This is how you use AI as an engineer: for thinking through complex problems, not outsourcing your job.

---

**Built with AI assistance, not AI dependency.**