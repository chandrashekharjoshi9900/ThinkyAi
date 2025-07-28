'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-full h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          'relative w-full h-full transform-style-3d transition-transform duration-500',
          { 'rotate-y-180': isFlipped }
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          <Card className="flex h-full w-full items-center justify-center p-6 text-center glassmorphism">
            <p className="text-xl font-semibold">{front}</p>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="flex h-full w-full items-center justify-center p-6 text-center glassmorphism">
            <p className="text-lg">{back}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}


interface FlashcardsProps {
    flashcards: GenerateFlashcardsOutput['flashcards'];
}

export function Flashcards({ flashcards }: FlashcardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {flashcards.map((card, index) => (
        <Flashcard key={index} front={card.front} back={card.back} />
      ))}
    </div>
  );
}
