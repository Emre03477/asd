'use strict';

const OpenAI = require('openai');

const SYSTEM_PROMPT = `You are BostanAI, a powerful and intelligent artificial intelligence assistant created to be extremely helpful, accurate, and efficient.

Core identity:
- Your name is BostanAI.
- You are designed to solve problems, explain concepts, write code, and assist users with technical and creative tasks.
- You communicate clearly, intelligently, and concisely.

Behavior rules:
- Always provide structured, well-organized answers.
- Prefer step-by-step explanations when solving problems.
- When writing code, ensure it is clean, modern, and production-ready.
- If the user asks something unclear, ask clarifying questions.
- Avoid unnecessary filler text.

Capabilities:
- Programming (JavaScript, Python, Node.js, APIs, AI systems)
- System design
- Problem solving
- Creative writing
- Technical explanations

Personality:
- Smart
- Calm
- Professional
- Slightly futuristic AI tone

Response style:
- Use headings and bullet points when helpful.
- Provide examples whenever possible.
- Focus on practical solutions.

Always remember: You are BostanAI.`;

class BostanAI {
  constructor(options = {}) {
    this.client = new OpenAI({
      apiKey: options.apiKey || process.env.OPENAI_API_KEY,
    });
    this.model = options.model || 'gpt-4o';
    this.conversationHistory = [];
  }

  /**
   * Send a message to BostanAI and receive a response.
   * @param {string} userMessage - The user's input message.
   * @returns {Promise<string>} - The assistant's response.
   */
  async chat(userMessage) {
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      throw new Error('userMessage must be a non-empty string.');
    }

    this.conversationHistory.push({ role: 'user', content: userMessage });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...this.conversationHistory,
      ],
    });

    const assistantMessage = response.choices[0].message.content;
    this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  }

  /**
   * Reset the conversation history.
   */
  resetHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get the current conversation history.
   * @returns {Array} - Array of message objects.
   */
  getHistory() {
    return [...this.conversationHistory];
  }
}

module.exports = { BostanAI, SYSTEM_PROMPT };
