// src/trigger/Example.ts
import { task, logger } from "@trigger.dev/sdk/v3";
import OpenAI, { ChatCompletionRequestMessage, ChatCompletionStreamResponse } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string, // Ensure the API key is of type string
});

export const generateContentTask = task({
  id: "generate-content",
  run: async ({ topic }: { topic: string }) => {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Write a detailed article about ${topic}` }
        ] as ChatCompletionRequestMessage[],
        stream: true,
      });

      const encoder = new TextEncoder();
      let result = '';

      for await (const chunk of stream as AsyncIterable<ChatCompletionStreamResponse>) {
        const content = chunk.choices[0]?.delta?.content || '';
        result += content;
      }

      return { content: result };
    } catch (error) {
      logger.error('Error generating content:', error);
      throw error;
    }
  },
});
