'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { BostanAI, SYSTEM_PROMPT } = require('../src/bostanai');

// ---------------------------------------------------------------------------
// Unit tests – these do NOT call the OpenAI API.
// The BostanAI class is tested with a mocked OpenAI client.
// ---------------------------------------------------------------------------

function makeMockClient(replyContent, capturedMessages) {
  return {
    chat: {
      completions: {
        create: async ({ messages }) => {
          if (capturedMessages) {
            capturedMessages.push(...messages);
          }
          return { choices: [{ message: { content: replyContent } }] };
        },
      },
    },
  };
}

describe('SYSTEM_PROMPT', () => {
  it('identifies the assistant as BostanAI', () => {
    assert.ok(SYSTEM_PROMPT.includes('BostanAI'));
  });

  it('includes core behavior rules', () => {
    assert.ok(SYSTEM_PROMPT.includes('structured, well-organized answers'));
    assert.ok(SYSTEM_PROMPT.includes('step-by-step explanations'));
  });

  it('lists required capabilities', () => {
    assert.ok(SYSTEM_PROMPT.includes('JavaScript'));
    assert.ok(SYSTEM_PROMPT.includes('System design'));
    assert.ok(SYSTEM_PROMPT.includes('Problem solving'));
  });
});

describe('BostanAI', () => {
  let bot;

  beforeEach(() => {
    bot = new BostanAI({ apiKey: 'test-key' });
    bot.client = makeMockClient('Hello from BostanAI!');
  });

  it('constructs with default model', () => {
    assert.equal(bot.model, 'gpt-4o');
  });

  it('constructs with custom model', () => {
    const custom = new BostanAI({ apiKey: 'k', model: 'gpt-3.5-turbo' });
    assert.equal(custom.model, 'gpt-3.5-turbo');
  });

  it('starts with an empty conversation history', () => {
    assert.deepEqual(bot.getHistory(), []);
  });

  it('chat() throws on empty or whitespace-only input', async () => {
    await assert.rejects(() => bot.chat(''), /non-empty string/);
    await assert.rejects(() => bot.chat('   '), /non-empty string/);
    await assert.rejects(() => bot.chat(null), /non-empty string/);
  });

  it('chat() appends user and assistant messages to history', async () => {
    await bot.chat('Hi');
    const history = bot.getHistory();
    assert.equal(history.length, 2);
    assert.equal(history[0].role, 'user');
    assert.equal(history[0].content, 'Hi');
    assert.equal(history[1].role, 'assistant');
    assert.equal(history[1].content, 'Hello from BostanAI!');
  });

  it('chat() sends system prompt as first message in every request', async () => {
    const captured = [];
    bot.client = makeMockClient('ok', captured);
    await bot.chat('Hello');
    assert.equal(captured[0].role, 'system');
    assert.ok(captured[0].content.includes('BostanAI'));
  });

  it('chat() includes full conversation history in API request', async () => {
    const captured = [];
    bot.client = makeMockClient('reply 1', captured);
    await bot.chat('msg 1');

    const captured2 = [];
    bot.client = makeMockClient('reply 2', captured2);
    await bot.chat('msg 2');

    // Second request should contain system prompt + 2 prior turns + new user msg
    assert.equal(captured2.length, 4); // system + user1 + assistant1 + user2
    assert.equal(captured2[0].role, 'system');
    assert.equal(captured2[1].content, 'msg 1');
    assert.equal(captured2[2].content, 'reply 1');
    assert.equal(captured2[3].content, 'msg 2');
  });
  it('chat() returns the assistant reply', async () => {
    const reply = await bot.chat('Hello');
    assert.equal(reply, 'Hello from BostanAI!');
  });

  it('getHistory() returns a copy of the history', async () => {
    await bot.chat('test');
    const h1 = bot.getHistory();
    h1.push({ role: 'user', content: 'injected' });
    assert.equal(bot.getHistory().length, 2); // original untouched
  });

  it('resetHistory() clears the conversation history', async () => {
    await bot.chat('first message');
    assert.equal(bot.getHistory().length, 2);
    bot.resetHistory();
    assert.deepEqual(bot.getHistory(), []);
  });

  it('maintains multi-turn conversation history', async () => {
    bot.client = makeMockClient('reply 1');
    await bot.chat('turn 1');

    bot.client = makeMockClient('reply 2');
    await bot.chat('turn 2');

    const history = bot.getHistory();
    assert.equal(history.length, 4);
    assert.equal(history[2].content, 'turn 2');
    assert.equal(history[3].content, 'reply 2');
  });
});
