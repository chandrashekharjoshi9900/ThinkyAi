'use client';

import { useState } from 'react';
import { BrainCircuit, BookOpen, Layers, Lightbulb, Loader2, ServerCrash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getLearningContent, type LearningContent } from '@/app/actions';
import { TopicForm } from '@/components/topic-form';
import { ExplanationCard } from '@/components/explanation-card';
import { QuizCard } from '@/components/quiz-card';
import { Flashcards } from '@/components/flashcards';
import { ScrollUpButton } from '@/components/scroll-up-button';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<LearningContent | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setContent(null);

    const result = await getLearningContent(topic);

    if (result.error) {
      setError(result.error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    } else {
      setContent(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Welcome to <span className="text-primary">LearnAI</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Your personal AI-powered assistant to make learning any topic simple and fun.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-2xl">
        <TopicForm onGenerate={handleGenerate} isLoading={isLoading} />
      </section>

      <div className="mt-12 space-y-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg">Generating your learning materials...</p>
            <p className="text-sm">This may take a moment. Please wait.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-12 text-destructive">
            <ServerCrash className="h-12 w-12" />
            <p className="font-headline text-lg font-semibold">Generation Failed</p>
            <p className="text-center">{error}</p>
          </div>
        )}

        {content && !isLoading && !error && (
          <div className="space-y-12">
            <section id="explanation">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-foreground font-headline">
                <Lightbulb className="h-8 w-8 text-primary" />
                AI Explanation
              </h2>
              <ExplanationCard explanation={content.explanation} />
            </section>
            <section id="quiz">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-foreground font-headline">
                <BrainCircuit className="h-8 w-8 text-primary" />
                Knowledge Check
              </h2>
              <QuizCard questions={content.quiz} />
            </section>
            <section id="flashcards">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-foreground font-headline">
                <Layers className="h-8 w-8 text-primary" />
                Revision Flashcards
              </h2>
              <Flashcards flashcards={content.flashcards} />
            </section>
          </div>
        )}
      </div>
      <ScrollUpButton />
    </div>
  );
}
