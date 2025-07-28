'use server';

import { generateExplanation, type GenerateExplanationOutput } from '@/ai/flows/generate-explanation';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards';

export type LearningContent = {
    explanation: GenerateExplanationOutput['explanation'];
    quiz: GenerateQuizOutput['questions'];
    flashcards: GenerateFlashcardsOutput['flashcards'];
}

type ActionResult = {
    error?: string;
} & LearningContent | { error: string };


export async function getLearningContent(topic: string): Promise<ActionResult> {
    if (!topic || topic.trim().length < 3) {
        return { error: 'Please enter a valid topic (at least 3 characters).' };
    }

    try {
        const explanationResult = await generateExplanation({ topic });
        const explanation = explanationResult.explanation;

        if (!explanation) {
            return { error: 'Failed to generate an explanation for this topic.' };
        }

        const [quizResult, flashcardsResult] = await Promise.all([
            generateQuiz({ topic }),
            generateFlashcards({ topic, explanation })
        ]);

        if (!quizResult?.questions?.length || !flashcardsResult?.flashcards?.length) {
            return { error: 'Failed to generate learning materials. Please try a different topic.' };
        }

        return {
            explanation,
            quiz: quizResult.questions,
            flashcards: flashcardsResult.flashcards,
        };

    } catch (e) {
        console.error("Error generating learning content:", e);
        return { error: 'An unexpected error occurred while generating content. Please try again later.' };
    }
}
