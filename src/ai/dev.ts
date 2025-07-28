import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/generate-explanation.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/generate-reasoning.ts';
