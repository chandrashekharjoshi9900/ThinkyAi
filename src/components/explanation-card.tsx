// src/components/explanation-card.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Languages, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/app/actions';

interface ExplanationCardProps {
  explanation: string;
}

export function ExplanationCard({ explanation }: ExplanationCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const handleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Text-to-speech is not supported by your browser.',
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = (isTranslated ? translatedText : explanation).replace(/#+\s|\*\*/g, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          variant: 'destructive',
          title: 'Speech Error',
          description: 'Could not play the audio.',
        });
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };
  
  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedText) {
      setIsTranslated(true);
      return;
    }

    setIsTranslating(true);
    const result = await getTranslation(explanation, 'Hindi');
    setIsTranslating(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: result.error,
      });
    } else if (result.translatedText) {
      setTranslatedText(result.translatedText);
      setIsTranslated(true);
       toast({
        title: 'Translated to Hindi',
        description: 'Showing the translated text.',
      });
    }
  }

  useEffect(() => {
    // Reset translation when explanation changes
    setIsTranslated(false);
    setTranslatedText('');
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [explanation]);

  const textToShow = isTranslated ? translatedText : explanation;

  const renderExplanation = (text: string) => {
    const lines = text.split('\n');
    let listItems: string[] = [];
    const renderedElements = [];

    const flushList = () => {
        if (listItems.length > 0) {
            renderedElements.push(
                <ul key={`ul-${renderedElements.length}`} className="list-disc pl-5 space-y-1">
                    {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('# ')) {
            flushList();
            renderedElements.push(<h1 key={index} className="text-2xl font-bold mt-8 border-b pb-2" dangerouslySetInnerHTML={{ __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />);
        } else if (line.startsWith('## ')) {
            flushList();
            renderedElements.push(<h2 key={index} className="text-xl font-bold mt-6 border-b pb-2" dangerouslySetInnerHTML={{ __html: line.substring(3).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />);
        } else if (line.startsWith('### ')) {
            flushList();
            renderedElements.push(<h3 key={index} className="text-lg font-semibold mt-4" dangerouslySetInnerHTML={{ __html: line.substring(4).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />);
        } else if (line.trim().startsWith('- ')) {
            listItems.push(line.trim().substring(2));
        } else if (line.trim() !== '') {
            flushList();
            renderedElements.push(<p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />);
        }
    });

    flushList(); // Make sure to render any remaining list items
    return renderedElements;
  };

  return (
    <Card className="glassmorphism overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Detailed Explanation</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
         <div>{renderExplanation(textToShow)}</div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleTranslate} disabled={isTranslating} className="transition-all hover:scale-105">
          {isTranslating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Languages className="mr-2 h-4 w-4" />
          )}
          {isTranslated ? 'Show English' : 'Translate to Hindi'}
        </Button>
        <Button onClick={handleTextToSpeech} className="transition-all hover:scale-105">
          {isSpeaking ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
          {isSpeaking ? 'Stop' : 'Listen'}
        </Button>
      </CardFooter>
    </Card>
  );
}
