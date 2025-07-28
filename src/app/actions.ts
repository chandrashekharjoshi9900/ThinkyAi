'use server';

import { generateExplanation, type GenerateExplanationOutput } from '@/ai/flows/generate-explanation';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards';
import { translateText, type TranslateTextOutput } from '@/ai/flows/translate-text';
import { generateReasoning, type GenerateReasoningOutput } from '@/ai/flows/generate-reasoning';


export type ExplanationContent = {
    explanation: GenerateExplanationOutput['explanation'];
}
export type QuizContent = {
    quiz: GenerateQuizOutput['questions'];
}
export type FlashcardsContent = {
    flashcards: GenerateFlashcardsOutput['flashcards'];
}
export type TranslationContent = {
    translatedText: TranslateTextOutput['translatedText'];
}
export type ReasoningContent = {
    answer: GenerateReasoningOutput['answer'];
}

type ExplanationActionResult = { error?: string } & ExplanationContent;
type QuizActionResult = { error?: string } & QuizContent;
type FlashcardsActionResult = { error?: string } & FlashcardsContent;
type TranslationActionResult = { error?: string } & TranslationContent;
type ReasoningActionResult = { error?: string } & ReasoningContent;


export async function getExplanation(topic: string): Promise<ExplanationActionResult> {
    if (!topic || topic.trim().length < 3) {
        return { error: 'Please enter a valid topic (at least 3 characters).' };
    }

    try {
        const explanationResult = await generateExplanation({ topic });
        const explanation = explanationResult.explanation;

        if (!explanation) {
            return { error: 'Failed to generate an explanation for this topic.' };
        }
        
        return {
            explanation
        };

    } catch (e) {
        console.error("Error generating explanation:", e);
        return { error: 'An unexpected error occurred while generating content. Please try again later.' };
    }
}

export async function getQuiz(topic: string, count: number): Promise<QuizActionResult> {
     if (!topic || topic.trim().length < 3) {
        return { error: 'Invalid topic.' };
    }
    if(count < 1){
        return { error: 'Number of questions must be at least 1.' };
    }

    try {
        const quizResult = await generateQuiz({ topic, count });

        if (!quizResult?.questions?.length) {
            return { error: 'Failed to generate quiz. Please try a different topic.' };
        }

        return {
            quiz: quizResult.questions
        };

    } catch (e) {
        console.error("Error generating quiz:", e);
        return { error: 'An unexpected error occurred while generating quiz. Please try again later.' };
    }
}


export async function getFlashcards(topic: string, explanation: string): Promise<FlashcardsActionResult> {
     if (!topic || topic.trim().length < 3) {
        return { error: 'Invalid topic.' };
    }
     if (!explanation) {
        return { error: 'Explanation is required to generate flashcards.' };
    }

    try {
        const flashcardsResult = await generateFlashcards({ topic, explanation });

        if (!flashcardsResult?.flashcards?.length) {
            return { error: 'Failed to generate flashcards. Please try a different topic.' };
        }

        return {
            flashcards: flashcardsResult.flashcards,
        };

    } catch (e) {
        console.error("Error generating flashcards:", e);
        return { error: 'An unexpected error occurred while generating flashcards. Please try again later.' };
    }
}

export async function getTranslation(text: string, language: string): Promise<TranslationActionResult> {
    if (!text) {
        return { error: 'Text to translate is required.' };
    }
    if (!language) {
        return { error: 'Target language is required.' };
    }
    try {
        const result = await translateText({ text, language });
        if (!result.translatedText) {
            return { error: 'Failed to translate text.' };
        }
        return {
            translatedText: result.translatedText,
        };
    } catch (e) {
        console.error("Error translating text:", e);
        return { error: 'An unexpected error occurred while translating. Please try again later.' };
    }
}

export async function getReasoning(topic: string, context: string, question: string): Promise<ReasoningActionResult> {
    if (!topic) return { error: 'Invalid topic.' };
    if (!context) return { error: 'Invalid context.' };
    if (!question || question.trim().length < 2) {
        return { error: 'Please enter a valid question.' };
    }

    try {
        const result = await generateReasoning({ topic, context, question });
        if (!result.answer) {
            return { error: 'Failed to get an answer.' };
        }
        return {
            answer: result.answer,
        };
    } catch (e) {
        console.error("Error generating reasoning:", e);
        return { error: 'An unexpected error occurred while getting an answer. Please try again later.' };
    }
}
