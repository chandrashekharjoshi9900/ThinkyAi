'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExplanationCardProps {
  explanation: string;
}

export function ExplanationCard({ explanation }: ExplanationCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
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
      const utterance = new SpeechSynthesisUtterance(explanation);
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
  
  const handleTranslate = () => {
    setIsTranslated(!isTranslated);
    toast({
      title: isTranslated ? 'Switched to English' : 'Translated to Hindi',
      description: isTranslated ? 'Showing original text.' : 'This is a mock translation. Full functionality would require an API.',
    });
  }

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const textToShow = isTranslated
    ? 'यह एक नकली अनुवाद है। वास्तविक कार्यक्षमता के लिए एक अनुवाद एपीआई की आवश्यकता होगी। प्रत्येक विषय को सरलता से सीखने के लिए यहां स्पष्टीकरण दिखाई देगा।'
    : explanation;

  return (
    <Card className="glassmorphism overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Detailed Explanation</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
        <p>{textToShow}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleTranslate} className="transition-all hover:scale-105">
          <Languages className="mr-2 h-4 w-4" />
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
