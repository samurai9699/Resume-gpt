import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
});

export function getEnvConfig() {
  try {
    const config = envSchema.parse({
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    });

    return config;
  } catch (error) {
    console.error("❌ Missing environment variables:", error);
    throw new Error('Missing environment variables. Please check your .env file and ensure VITE_OPENAI_API_KEY is set.');
  }
}