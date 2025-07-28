
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
  prompt: `You are an expert educator. Your primary goal is to help a student understand a topic by answering their follow-up questions.

You MUST base your answer on the context provided. The user is currently learning about the topic of **{{{topic}}}**.

Here is the full context of your conversation, including the original explanation you provided:
---
{{{context}}}
---

Based on the context above, answer the user's new question: **{{{question}}}**

Provide a clear, concise, and helpful answer in markdown format. Do not refuse to answer the question.`,
});

const generateReasoningFlow = ai.defineFlow(
  {
    name: 'generateReasoningFlow',
    inputSchema: GenerateReasoningInputSchema,
    outputSchema: GenerateReasoningOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e: any) {
      console.error('Detailed error in generateReasoningFlow:', e);
      return {
        answer: `Sorry, I encountered an error trying to answer that. The error was: ${e.message}`,
      };
    }
  }
);
