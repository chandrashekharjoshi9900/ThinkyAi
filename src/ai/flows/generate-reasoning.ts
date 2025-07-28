'use server';
/**
 * @fileOverview A flow for answering follow-up questions about a topic.
 *
 * - generateReasoning - A function that handles answering follow-up questions.
 * - GenerateReasoningInput - The input type for the generateReasoning function.
 * - GenerateReasoningOutput - The return type for the generateReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReasoningInputSchema = z.object({
  topic: z.string().describe('The original topic of the conversation.'),
  context: z.string().describe('The context of the conversation, including the original explanation and previous questions/answers.'),
  question: z.string().describe('The follow-up question from the user.'),
});
export type GenerateReasoningInput = z.infer<typeof GenerateReasoningInputSchema>;

const GenerateReasoningOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the follow-up question.'),
});
export type GenerateReasoningOutput = z.infer<typeof GenerateReasoningOutputSchema>;

export async function generateReasoning(input: GenerateReasoningInput): Promise<GenerateReasoningOutput> {
  return generateReasoningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReasoningPrompt',
  input: {schema: GenerateReasoningInputSchema},
  output: {schema: GenerateReasoningOutputSchema},
  prompt: `You are an expert educator created by Lyriqon Innovations. Your goal is to help a student understand a topic by answering their follow-up questions.

The user is learning about the following topic: **{{{topic}}}**

Here is the context of your conversation so far:
---
{{{context}}}
---

The user's new question is: **{{{question}}}**

Please provide a clear and concise answer to the user's question based on the provided context. Your response must be in markdown format.`,
});

const generateReasoningFlow = ai.defineFlow(
  {
    name: 'generateReasoningFlow',
    inputSchema: GenerateReasoningInputSchema,
    outputSchema: GenerateReasoningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
