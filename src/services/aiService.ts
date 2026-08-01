import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import logger from '../utils/logger.js';

export type AIProvider = 'openai' | 'anthropic';

interface AIMessageContext {
  system?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export class AIService {
  private provider: AIProvider;
  private model: string;

  constructor() {
    // Determine which provider to use based on available API keys
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (hasOpenAI) {
      this.provider = 'openai';
      this.model = 'gpt-4-turbo';
    } else if (hasAnthropic) {
      this.provider = 'anthropic';
      this.model = 'claude-3-sonnet-20240229';
    } else {
      throw new Error(
        'No AI provider configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY'
      );
    }

    logger.info(`AI Service initialized with provider: ${this.provider}`);
  }

  async generateResponse(
    prompt: string,
    context?: AIMessageContext
  ): Promise<string> {
    try {
      const systemPrompt =
        context?.system ||
        'You are a helpful Discord bot assistant. Provide concise, friendly responses.';

      const messages =
        context?.conversationHistory && context.conversationHistory.length > 0
          ? context.conversationHistory.map((msg) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))
          : [{ role: 'user' as const, content: prompt }];

      const selectedModel = this.provider === 'openai' ? openai(this.model) : anthropic(this.model);

      const result = await generateText({
        model: selectedModel,
        system: systemPrompt,
        messages: messages,
        maxTokens: 1000
      });

      return result.text;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async streamResponse(
    prompt: string,
    context?: AIMessageContext
  ) {
    try {
      const systemPrompt =
        context?.system ||
        'You are a helpful Discord bot assistant. Provide concise, friendly responses.';

      const messages =
        context?.conversationHistory && context.conversationHistory.length > 0
          ? context.conversationHistory.map((msg) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))
          : [{ role: 'user' as const, content: prompt }];

      const selectedModel = this.provider === 'openai' ? openai(this.model) : anthropic(this.model);

      return streamText({
        model: selectedModel,
        system: systemPrompt,
        messages: messages,
        maxTokens: 1000
      });
    } catch (error) {
      logger.error('Error streaming AI response:', error);
      throw new Error('Failed to stream AI response');
    }
  }

  getProviderInfo() {
    return {
      provider: this.provider,
      model: this.model
    };
  }
}

export default new AIService();
