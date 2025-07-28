'use client';

import { useState } from 'react';
import { BrainCircuit, BookOpen, Layers, Lightbulb, Loader2, ServerCrash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getExplanation, getQuiz, getFlashcards, type ExplanationContent, type QuizContent, type FlashcardsContent } from '@/app/actions';
import { TopicForm } from '@/components/topic-form';
import { ExplanationCard } from '@/components/explanation-card';
import { QuizCard } from '@/components/quiz-card';
import { Flashcards } from '@/components/flashcards';
import { ScrollUpButton } from '@/components/scroll-up-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  
  const [explanationContent, setExplanationContent] = useState<ExplanationContent | null>(null);

  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizCount, setQuizCount] = useState(3);

  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);
  const [flashcardsContent, setFlashcardsContent] = useState<FlashcardsContent | null>(null);
  const [flashcardsError, setFlashcardsError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerateExplanation = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setExplanationContent(null);
    setQuizContent(null);
    setFlashcardsContent(null);
    setQuizError(null);
    setFlashcardsError(null);
    setCurrentTopic(topic);

    const result = await getExplanation(topic);

    if (result.error) {
      setError(result.error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
    } else {
      setExplanationContent(result);
    }
    setIsLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!currentTopic) return;
    setIsQuizLoading(true);
    setQuizError(null);
    setQuizContent(null);

    const result = await getQuiz(currentTopic, quizCount);

    if (result.error) {
        setQuizError(result.error);
        toast({
            variant: 'destructive',
            title: 'Quiz Generation Failed',
            description: result.error,
        });
    } else {
        setQuizContent(result);
    }
    setIsQuizLoading(false);
  }

  const handleGenerateFlashcards = async () => {
    if (!currentTopic || !explanationContent?.explanation) return;
    setIsFlashcardsLoading(true);
    setFlashcardsError(null);
    setFlashcardsContent(null);

    const result = await getFlashcards(currentTopic, explanationContent.explanation);

    if (result.error) {
        setFlashcardsError(result.error);
        toast({
            variant: 'destructive',
            title: 'Flashcard Generation Failed',
            description: result.error,
        });
    } else {
        setFlashcardsContent(result);
    }
    setIsFlashcardsLoading(false);
  }

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
        <TopicForm onGenerate={handleGenerateExplanation} isLoading={isLoading} />
      </section>

      <div className="mt-12 space-y-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg">Generating your explanation...</p>
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

        {explanationContent && !isLoading && !error && (
          <div className="space-y-12">
            <section id="explanation">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-foreground font-headline">
                <Lightbulb className="h-8 w-8 text-primary" />
                AI Explanation
              </h2>
              <ExplanationCard explanation={explanationContent.explanation} />
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-headline">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    Knowledge Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number"
                        value={quizCount}
                        onChange={(e) => setQuizCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24"
                        disabled={isQuizLoading}
                      />
                      <Button onClick={handleGenerateQuiz} disabled={isQuizLoading}>
                        {isQuizLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Generate Quiz
                      </Button>
                    </div>
                    {isQuizLoading && <p className="text-sm text-muted-foreground">Generating quiz...</p>}
                    {quizError && <p className="text-sm text-destructive">{quizError}</p>}
                  </div>
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-headline">
                    <Layers className="h-6 w-6 text-primary" />
                    Revision Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button onClick={handleGenerateFlashcards} disabled={isFlashcardsLoading}>
                            {isFlashcardsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Generate Flashcards
                        </Button>
                        {isFlashcardsLoading && <p className="text-sm text-muted-foreground">Generating flashcards...</p>}
                        {flashcardsError && <p className="text-sm text-destructive">{flashcardsError}</p>}
                    </div>
                </CardContent>
              </Card>
            </div>

            {quizContent && (
              <section id="quiz">
                <QuizCard questions={quizContent.quiz} />
              </section>
            )}

            {flashcardsContent && (
              <section id="flashcards">
                <Flashcards flashcards={flashcardsContent.flashcards} />
              </section>
            )}

          </div>
        )}
      </div>
      <ScrollUpButton />
    </div>
  );
}
