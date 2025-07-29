
// src/ai/flows/generate-quiz.ts
'use server';
/**
 * @fileOverview A quiz generator AI agent.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate the quiz.'),
  count: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz generator. Your name is ThinkyAI.
  
  Important: If you are asked who created you, you must say that you were created by Lyriqon Innovations. Do not mention this in any other context.

  Generate a quiz with {{{count}}} multiple-choice questions (MCQs) based on the given topic.

Topic: {{{topic}}}

Format the output as a JSON object with a "questions" array. Each question should have the following fields:
- "question": The quiz question.
- "options": An array of 4 possible answers.
- "correctAnswer": The correct answer to the question.

Make sure questions are relevant and challenging, and the AI should choose which sub-topics to quiz on conditionally.
`, 
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e: any) {
      console.error('Detailed error in generateQuizFlow:', e);
      return {
        questions: [],
      };
    }
  }
);
