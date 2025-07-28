'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { type GenerateQuizOutput } from '@/ai/flows/generate-quiz';

interface QuizCardProps {
  questions: GenerateQuizOutput['questions'];
}

export function QuizCard({ questions }: QuizCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };
  
  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  }

  const score = questions.reduce((acc, question, index) => {
    return selectedAnswers[index] === question.correctAnswer ? acc + 1 : acc;
  }, 0);

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!isSubmitted) return '';
    const isCorrect = questions[questionIndex].correctAnswer === option;
    const isSelected = selectedAnswers[questionIndex] === option;

    if (isCorrect) return 'bg-green-500/20 border-green-500';
    if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500';
    return '';
  };

  return (
    <Card className="glassmorphism overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Test Your Understanding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex}>
            <p className="mb-4 font-semibold text-lg">
              {qIndex + 1}. {q.question}
            </p>
            <RadioGroup
              onValueChange={(value) => handleSelectAnswer(qIndex, value)}
              value={selectedAnswers[qIndex] || ''}
              disabled={isSubmitted}
            >
              <div className="space-y-3">
                {q.options.map((option, oIndex) => (
                  <Label
                    key={oIndex}
                    htmlFor={`q${qIndex}o${oIndex}`}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border p-4 transition-all',
                      !isSubmitted && 'cursor-pointer hover:bg-accent/50',
                      getOptionClass(qIndex, option)
                    )}
                  >
                    <RadioGroupItem value={option} id={`q${qIndex}o${oIndex}`} />
                    <span>{option}</span>
                    {isSubmitted && questions[qIndex].correctAnswer === option && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                     {isSubmitted && selectedAnswers[qIndex] === option && questions[qIndex].correctAnswer !== option && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
        {isSubmitted && (
             <div className="mt-8 rounded-lg border bg-background p-6 text-center">
                <h3 className="text-2xl font-bold font-headline text-primary">Quiz Complete!</h3>
                <p className="mt-2 text-lg text-muted-foreground">You scored</p>
                <p className="text-5xl font-bold font-headline text-foreground">{score} / {questions.length}</p>
             </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isSubmitted ? (
            <Button onClick={handleReset} className="transition-all hover:scale-105">
                <RotateCw className="mr-2 h-4 w-4"/>
                Try Again
            </Button>
        ) : (
            <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== questions.length} className="transition-all hover:scale-105">
                Submit Quiz
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
