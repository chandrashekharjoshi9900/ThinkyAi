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
  explanation: z.string().describe('The AI-generated explanation of the topic.'),
});
export type GenerateExplanationOutput = z.infer<typeof GenerateExplanationOutputSchema>;

export async function generateExplanation(input: GenerateExplanationInput): Promise<GenerateExplanationOutput> {
  return generateExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationPrompt',
  input: {schema: GenerateExplanationInputSchema},
  output: {schema: GenerateExplanationOutputSchema},
  prompt: `You are an expert educator specializing in creating educational explanations for students.

You will use this information to generate an explanation of the topic. Conditionally include extra facts and information related to the topic if it enhances the explanation and would benefit the student's understanding.

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
