import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '',
});

// A simple function to detect stock price queries and extract the ticker symbol
function detectStockQuery(message: string): string | null {
  const pattern = /{(\w+)}/i;
  const match = message.match(pattern);
  if (match) {
    console.log(`Detected stock price query for: ${match[1].toUpperCase()}`);
    return match[1].toUpperCase();
  }
  return null;
}

async function fetchStockPrice(symbol: string): Promise<string> {
  try {
    const response = await fetch(`https://engage-dev.com/stonkai/api/stock/${symbol}`);
    const data = await response.json();
    console.log(`Fetched stock data: ${JSON.stringify(data.ticker_info.currentPrice)}`);

    // return `The current price of ${symbol} is $${data.ticker_info.currentPrice}`;
    return `Here is all the most current stock information for ${symbol}: $${JSON.stringify(data.ticker_info)}`;
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return `I couldn't retrieve the stock price for ${symbol}.`;
  }
}


export const POST: RequestHandler = async ({ request }) => {
  let { messages }: { messages: ChatMessage[] } = await request.json();

  // Define an initial instruction for ChatGPT
  const initialInstruction: ChatMessage = {
    role: 'system',
    content: 'You are a helpful AI assistant. All of your responses should be written using plain HTML and minimal TailwindCSS styling for lists, tables, h1-h6 headings, and other standard html elements. No colors.',
  };

  // Insert the initial instruction at the beginning of the conversation
  messages = [initialInstruction, ...messages];

  const lastUserMessage = messages[messages.length - 1].content;
  const symbol = detectStockQuery(lastUserMessage);

  if (symbol) {
    const stockMessage = await fetchStockPrice(symbol);

    // Add the stock message as system-generated information
    messages.push({
      role: 'system',
      content: stockMessage,
    });

    // Add a reiteration for clarity if needed
    messages.push({
      role: 'system',
      content: `To reiterate, ${stockMessage}`,
    });
  }

  console.log(JSON.stringify(messages, null, 2));

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
};
