'use client';

import { useState, useEffect, useRef } from 'react';
import { BrainCircuit, BookOpen, Layers, Lightbulb, Loader2, ServerCrash, History, Trash2, MessageSquare, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getExplanation, getQuiz, getFlashcards, getReasoning, type ExplanationContent, type QuizContent, type FlashcardsContent, type ReasoningContent } from '@/app/actions';
import { TopicForm } from '@/components/topic-form';
import { ExplanationCard } from '@/components/explanation-card';
import { QuizCard } from '@/components/quiz-card';
import { Flashcards } from '@/components/flashcards';
import { ScrollUpButton } from '@/components/scroll-up-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth-provider';
import { AuthDialog } from '@/components/auth-dialog';
import { Textarea } from '@/components/ui/textarea';

const GUEST_LIMIT = 3;

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
}

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

  const [isReasoningLoading, setIsReasoningLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [guestGenerations, setGuestGenerations] = useState(0);

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedCount = localStorage.getItem('guestGenerations');
    if (storedCount) {
      setGuestGenerations(parseInt(storedCount, 10));
    }
    const storedHistory = localStorage.getItem('learnAiHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const updateHistory = (newTopic: string) => {
    const updatedHistory = [newTopic, ...history.filter(t => t.toLowerCase() !== newTopic.toLowerCase()).slice(0, 19)];
    setHistory(updatedHistory);
    localStorage.setItem('learnAiHistory', JSON.stringify(updatedHistory));
  };
  
  const deleteFromHistory = (topicToDelete: string) => {
    const updatedHistory = history.filter(t => t.toLowerCase() !== topicToDelete.toLowerCase());
    setHistory(updatedHistory);
    localStorage.setItem('learnAiHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('learnAiHistory');
  };

  const handleGuestLimit = () => {
    if (!user) {
      const newCount = guestGenerations + 1;
      setGuestGenerations(newCount);
      localStorage.setItem('guestGenerations', newCount.toString());
      if (newCount >= GUEST_LIMIT) {
        setIsAuthDialogOpen(true);
        return true; // Limit reached
      }
    }
    return false; // Limit not reached or user is logged in
  };

  const handleGenerateExplanation = async (topic: string) => {
    if (!user && guestGenerations >= GUEST_LIMIT) {
        setIsAuthDialogOpen(true);
        return;
    }

    setIsLoading(true);
    setError(null);
    setExplanationContent(null);
    setQuizContent(null);
    setFlashcardsContent(null);
    setQuizError(null);
    setFlashcardsError(null);
    setCurrentTopic(topic);
    setConversation([]);
    setFollowUpQuestion('');
    
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
      if (!handleGuestLimit()) {
        updateHistory(topic);
      };
    }
    setIsLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!currentTopic) return;
    if (!user && guestGenerations >= GUEST_LIMIT) {
        setIsAuthDialogOpen(true);
        return;
    }
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
        handleGuestLimit();
    }
    setIsQuizLoading(false);
  }

  const handleGenerateFlashcards = async () => {
    if (!currentTopic || !explanationContent?.explanation) return;
    if (!user && guestGenerations >= GUEST_LIMIT) {
        setIsAuthDialogOpen(true);
        return;
    }

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
        handleGuestLimit();
    }
    setIsFlashcardsLoading(false);
  }

  const handleReasoning = async () => {
    if (!followUpQuestion.trim() || !explanationContent?.explanation) return;
     if (!user && guestGenerations >= GUEST_LIMIT) {
        setIsAuthDialogOpen(true);
        return;
    }
    
    setIsReasoningLoading(true);
    
    const userMessage: ConversationMessage = { role: 'user', content: followUpQuestion };
    setConversation(prev => [...prev, userMessage]);
    
    const context = `Original Explanation: ${explanationContent.explanation}\n\nConversation History:\n${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}`;
    
    const result = await getReasoning(currentTopic, context, followUpQuestion);
    setFollowUpQuestion('');

    if(result.error) {
        const errorMessage: ConversationMessage = { role: 'assistant', content: `Sorry, an error occurred: ${result.error}` };
        setConversation(prev => [...prev, errorMessage]);
         toast({
            variant: 'destructive',
            title: 'Follow-up Failed',
            description: result.error,
        });
    } else {
        const assistantMessage: ConversationMessage = { role: 'assistant', content: result.answer };
        setConversation(prev => [...prev, assistantMessage]);
        handleGuestLimit();
    }

    setIsReasoningLoading(false);
  };

  const renderMarkdown = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/(\n)/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const remainingGenerations = user ? 'Unlimited' : Math.max(0, GUEST_LIMIT - guestGenerations);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Welcome to <span className="text-primary">ThinkyAI</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Your personal AI-powered assistant to make learning any topic simple and fun.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-2xl">
        <TopicForm onGenerate={handleGenerateExplanation} isLoading={isLoading} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
            Generations remaining: <span className="font-bold text-primary">{remainingGenerations}</span>
        </p>
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
        
        {!isLoading && !error && !explanationContent && history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-headline">
                <History className="h-6 w-6 text-primary" />
                Recent Topics
              </CardTitle>
              <CardDescription>Click a topic to revisit it or clear your history.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {history.map((topic, index) => (
                  <li key={index} className="flex items-center justify-between gap-4 rounded-md p-2 hover:bg-accent/50">
                    <button onClick={() => handleGenerateExplanation(topic)} className="flex-grow text-left text-primary hover:underline">
                      {topic}
                    </button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFromHistory(topic)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
            {history.length > 0 && (
                <CardFooter>
                    <Button variant="outline" onClick={clearHistory}>Clear History</Button>
                </CardFooter>
            )}
          </Card>
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
            
            <section id="reasoning">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 font-headline">
                            <MessageSquare className="h-6 w-6 text-primary" />
                            Ask a Follow-up Question
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                           {conversation.length > 0 && (
                               <div ref={conversationContainerRef} className="max-h-96 space-y-4 overflow-y-auto rounded-lg border bg-muted/50 p-4">
                                   {conversation.map((msg, index) => (
                                       <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            {msg.role === 'assistant' && <Bot className="h-6 w-6 shrink-0 text-primary" />}
                                            <div className={`rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                               {renderMarkdown(msg.content)}
                                            </div>
                                            {msg.role === 'user' && <User className="h-6 w-6 shrink-0 text-primary" />}
                                       </div>
                                   ))}
                                    {isReasoningLoading && (
                                      <div className="flex items-start gap-3">
                                          <Bot className="h-6 w-6 shrink-0 text-primary" />
                                          <div className="rounded-lg bg-background p-3">
                                               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                          </div>
                                      </div>
                                    )}
                               </div>
                           )}
                           <div className="flex items-start gap-4">
                                <Textarea 
                                    placeholder="e.g., Can you explain that in simpler terms?"
                                    value={followUpQuestion}
                                    onChange={e => setFollowUpQuestion(e.target.value)}
                                    onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReasoning(); }}}
                                    className="flex-grow"
                                    disabled={isReasoningLoading}
                                />
                                <Button onClick={handleReasoning} disabled={isReasoningLoading || !followUpQuestion.trim()}>
                                    {isReasoningLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Send"}
                                </Button>
                           </div>
                        </div>
                    </CardContent>
                </Card>
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
