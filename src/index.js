'use strict';

const readline = require('readline');
const { BostanAI } = require('./bostanai');

const BANNER = `
╔══════════════════════════════════════════╗
║               B O S T A N A I            ║
║   Powerful · Accurate · Intelligent      ║
╚══════════════════════════════════════════╝

Type your message and press Enter to chat.
Type /reset  to clear the conversation history.
Type /exit   to quit.
`;

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const bot = new BostanAI();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\nYou: ',
  });

  console.log(BANNER);
  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input === '/exit') {
      console.log('\nBostanAI: Goodbye. Stay curious.\n');
      rl.close();
      return;
    }

    if (input === '/reset') {
      bot.resetHistory();
      console.log('\nBostanAI: Conversation history cleared.\n');
      rl.prompt();
      return;
    }

    rl.pause();
    process.stdout.write('\nBostanAI: thinking...');

    try {
      const response = await bot.chat(input);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(`\nBostanAI: ${response}\n`);
    } catch (err) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.error(`\nError: ${err.message}\n`);
    }

    rl.resume();
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

main();
