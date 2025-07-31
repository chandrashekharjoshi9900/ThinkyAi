
// src/components/explanation-card.tsx
'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { Volume2, VolumeX, Languages, Loader2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/app/actions';
import katex from 'katex';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface ExplanationCardProps {
  explanation: string;
}

const CodeBlock = ({ lang, code }: { lang: string, code: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      toast({ title: 'Code copied to clipboard!' });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      toast({
        variant: 'destructive',
        title: 'Copy Failed',
        description: 'Could not copy code to clipboard.',
      });
    });
  };

  return (
    <div className="relative my-4 rounded-md bg-zinc-900 text-sm">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-700">
            <span className="text-xs font-sans text-zinc-400">{lang || 'code'}</span>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-zinc-700">
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
      <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem', padding: '1rem', backgroundColor: '#1E1E1E' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};


export function ExplanationCard({ explanation }: ExplanationCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      const textToSpeak = (isTranslated ? translatedText : explanation).replace(/#+\s|\*\*|\||\$\$|\$|```[\s\S]*?```/g, '');
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

  const handleCopy = () => {
    const textToCopy = (isTranslated ? translatedText : explanation);
    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        toast({
            title: 'Copied to clipboard!',
        });
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: 'destructive',
            title: 'Copy Failed',
            description: 'Could not copy text to clipboard.',
        });
    });
  };

  useEffect(() => {
    // Reset states when explanation changes
    setIsTranslated(false);
    setTranslatedText('');
    setIsCopied(false);
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [explanation]);

  const textToShow = isTranslated ? translatedText : explanation;

  const renderMathInText = (text: string) => {
    const inlineMathRegex = /\\((.*?)\\)/g;
    const blockMathRegex = /\\\[(.*?)\\\]/gs;
    
    let processedText = text.replace(/\$\$(.*?)\$\$/gs, (_match, latex) => {
        try {
            return katex.renderToString(latex, { throwOnError: false, displayMode: true });
        } catch (e) {
            return `Error rendering math: ${latex}`;
        }
    }).replace(/\$(.*?)\$/g, (_match, latex) => {
         try {
            return katex.renderToString(latex, { throwOnError: false, displayMode: false });
        } catch (e) {
            return `Error rendering math: ${latex}`;
        }
    });

    return processedText;
  }
  
  const renderExplanation = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);
    
    return parts.map((part, index) => {
        // Part is code
        if (index % 3 === 2) {
            const lang = parts[index - 1] || '';
            return <CodeBlock key={index} lang={lang} code={part} />;
        }
        // Part is language identifier
        if (index % 3 === 1) {
            return null;
        }

        // Part is regular text
        const lines = part.split('\n');
        const renderedElements: JSX.Element[] = [];
        let inTable = false;
        let tableHeader: string[] = [];
        let tableRows: string[][] = [];

        const flushTable = () => {
            if (tableHeader.length > 0 && tableRows.length > 0) {
                renderedElements.push(
                    <div key={`table-${renderedElements.length}-${index}`} className="overflow-x-auto my-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted">
                                    {tableHeader.map((header, i) => <th key={i} className="border p-2 font-semibold" dangerouslySetInnerHTML={{ __html: renderMathInText(header) }} />)}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, i) => (
                                    <tr key={i} className="even:bg-background odd:bg-muted/50">
                                        {row.map((cell, j) => <td key={j} className="border p-2" dangerouslySetInnerHTML={{ __html: renderMathInText(cell) }} />)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
            inTable = false;
            tableHeader = [];
            tableRows = [];
        };

        const processLine = (line: string): string => {
            const withMath = renderMathInText(line);
            return withMath.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }

        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            const key = `${index}-${lineIndex}`;

            if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableHeader = trimmedLine.split('|').slice(1, -1).map(s => s.trim());
                } else {
                    const cells = trimmedLine.split('|').slice(1, -1).map(s => s.trim());
                    if (cells.every(cell => cell.match(/^-+$/))) {
                        // This is the separator line, ignore it
                    } else {
                        tableRows.push(cells);
                    }
                }
            } else {
                if (inTable) {
                    flushTable();
                }
                
                if (line.startsWith('# ')) {
                    renderedElements.push(<h1 key={key} className="text-2xl font-bold mt-8 border-b pb-2" dangerouslySetInnerHTML={{ __html: processLine(line.substring(2)) }} />);
                } else if (line.startsWith('## ')) {
                    renderedElements.push(<h2 key={key} className="text-xl font-bold mt-6 border-b pb-2" dangerouslySetInnerHTML={{ __html: processLine(line.substring(3)) }} />);
                } else if (line.startsWith('### ')) {
                    renderedElements.push(<h3 key={key} className="text-lg font-semibold mt-4" dangerouslySetInnerHTML={{ __html: processLine(line.substring(4)) }} />);
                } else if (line.trim().startsWith('- ')) {
                    const listKey = `ul-${key}`;
                    const lastElement = renderedElements[renderedElements.length - 1];
                    const newLi = <li key={key} dangerouslySetInnerHTML={{ __html: processLine(line.trim().substring(2)) }} />;

                    // If the last element was a list, append to it
                    if (lastElement && lastElement.type === 'ul') {
                         const updatedUl = React.cloneElement(lastElement, {}, [...lastElement.props.children, newLi]);
                         renderedElements[renderedElements.length -1] = updatedUl;
                    } else {
                         renderedElements.push(<ul key={listKey} className="list-disc pl-5 space-y-1">{newLi}</ul>);
                    }
                } else if (line.trim() !== '') {
                    renderedElements.push(<p key={key} dangerouslySetInnerHTML={{ __html: processLine(line) }} />);
                }
            }
        });

        if (inTable) {
            flushTable();
        }

        return <Fragment key={index}>{renderedElements}</Fragment>;
    });
  };

  return (
    <Card className="glassmorphism overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Detailed Explanation</CardTitle>
      </CardHeader>
      <CardContent ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
         <div>{renderExplanation(textToShow)}</div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy Explanation</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

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
