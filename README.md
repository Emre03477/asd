# BostanAI

BostanAI is a powerful and intelligent AI assistant built on Node.js and the OpenAI API. It is designed to be extremely helpful, accurate, and efficient.

## Features

- **Structured, well-organized answers** with headings and bullet points
- **Step-by-step explanations** for problem solving
- **Clean, modern, production-ready code** generation
- **Clarifying questions** when the user's request is ambiguous
- **Multi-turn conversation** with persistent history per session

## Capabilities

- Programming (JavaScript, Python, Node.js, APIs, AI systems)
- System design
- Problem solving
- Creative writing
- Technical explanations

## Getting Started

### Prerequisites

- Node.js ≥ 18
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
npm install
```

### Usage

```bash
export OPENAI_API_KEY=your_api_key_here
npm start
```

Once running, type your message and press **Enter**. Special commands:

| Command  | Description                        |
| -------- | ---------------------------------- |
| `/reset` | Clear the conversation history     |
| `/exit`  | Quit BostanAI                      |

### Programmatic Usage

```js
const { BostanAI } = require('./src/bostanai');

const bot = new BostanAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await bot.chat('Explain async/await in JavaScript.');
console.log(response);
```

## Project Structure

```
.
├── src/
│   ├── bostanai.js   # BostanAI class and system prompt
│   └── index.js      # CLI entry point
├── test/
│   └── bostanai.test.js
└── package.json
```

## License

ISC
