// src/ai/flows/generate-explanation.ts
'use server';
/**
 * @fileOverview A flow for generating explanations for a given topic, tailored with extra facts based on context.
 *
 * - generateExplanation - A function that handles the generation of explanations.
 * - GenerateExplanationInput - The input type for the generateExplanation function.
 * - GenerateExplanationOutput - The return type for the generateExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to generate an explanation for.'),
});
export type GenerateExplanationInput = z.infer<typeof GenerateExplanationInputSchema>;

const GenerateExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation of the topic, formatted in markdown.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are an expert educator specializing in creating clear, professional, and easy-to-understand educational content for students.

You will generate a well-structured explanation for the given topic. Your response must be in markdown format.

Use the following guidelines for your explanation:
- Start with a concise introduction.
- Use headings (#) and subheadings (##) to organize the content into logical sections.
- Use bullet points (-) or numbered lists (1.) for key concepts, steps, or features.
- Use bold formatting (**) for important keywords or terms.
- Keep paragraphs short and focused.
- End with a summary or concluding thought.

Topic: {{{topic}}}`,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
