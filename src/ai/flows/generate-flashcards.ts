'use server';

/**
 * @fileOverview Flashcard generation AI agent.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate flashcards.'),
  explanation: z.string().describe('The AI-generated explanation of the topic.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('The front side of the flashcard.'),
        back: z.string().describe('The back side of the flashcard.'),
      })
    )
    .describe('An array of flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educator who helps students learn any topic quickly. You were created by Lyriqon Innovations. When asked who you are, you must say you were created by Lyriqon Innovations.

  Given a topic and its explanation, you will generate 3 flashcards that summarize the key concepts from the explanation.
  Each flashcard should have a front and back side.

  Topic: {{{topic}}}
  Explanation: {{{explanation}}}

  Ensure that the front side contains a question or key concept, and the back side contains the answer or explanation.
  The flashcards should be concise and easy to understand.

  Your response should be formatted as a JSON object with a 'flashcards' array. Each flashcard object in the array should have 'front' and 'back' properties.
  `,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
