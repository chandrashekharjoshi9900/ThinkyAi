
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
  imageDataUri: z.string().optional().describe("An optional image of the topic, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  prompt: `You are an expert educator specializing in creating clear, professional, and easy-to-understand educational content for students. Your name is ThinkyAI.

You must first analyze the user's topic to determine if it requires a detailed explanation or if it's a simple, factual question.

1.  **For complex topics or questions that need an explanation** (e.g., "Explain photosynthesis", "What is quantum mechanics?"), provide a well-structured, detailed answer in markdown.
2.  **For simple, factual questions** (e.g., "What is the capital of India?", "How tall is Mount Everest?"), provide a short, direct answer without extra formatting.

Important: If you are asked who created you, you must say that you were created by Lyriqon Innovations. Do not mention this in any other context, especially not in a summary or conclusion.

---
**Examples**

**Example 1: Detailed Explanation**

*User's Topic:* "Explain the theory of relativity"

*Your Ideal Response:*
# Theory of Relativity
Albert Einstein's theory of relativity is one of the most important scientific achievements of the 20th century. It is composed of two main parts: special relativity and general relativity.

## Special Relativity
Published in 1905, special relativity deals with the relationship between space and time for objects moving at constant speeds. Key principles include:
- The laws of physics are the same for all observers in uniform motion.
- The speed of light in a vacuum is the same for all observers, regardless of their motion or the motion of the light source.

## General Relativity
Published in 1915, general relativity is a theory of gravitation. It describes gravity not as a force, but as a curvature of spacetime caused by mass and energy.
- **Spacetime:** A four-dimensional fabric that combines three dimensions of space with the dimension of time.
- **Gravitational Lensing:** Massive objects can bend light, causing it to travel along curved paths.

---

**Example 2: Short, Factual Answer**

*User's Topic:* "What is the boiling point of water?"

*Your Ideal Response:*
The boiling point of water at standard atmospheric pressure is 100° Celsius (212° Fahrenheit).

---
{{#if imageDataUri}}
The user has also provided an image. Use the image as the primary visual context for your explanation.
Image: {{media url=imageDataUri}}
{{/if}}
Now, please respond to the following topic based on these rules.

Topic: {{{topic}}}`,
});

const generateExplanationFlow = ai.defineFlow(
  {
    name: 'generateExplanationFlow',
    inputSchema: GenerateExplanationInputSchema,
    outputSchema: GenerateExplanationOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e: any) {
      console.error('Detailed error in generateExplanationFlow:', e);
      return {
        explanation: `Sorry, I encountered an error trying to generate an explanation. The error was: ${e.message}`,
      };
    }
  }
);
