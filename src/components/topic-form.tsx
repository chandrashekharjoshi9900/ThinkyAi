
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface TopicFormProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

export function TopicForm({ onGenerate, isLoading }: TopicFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onGenerate(data.topic);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex w-full items-center rounded-full border-2 border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Input
                    placeholder="e.g., Photosynthesis, Quantum Physics, The Roman Empire..."
                    className="h-auto flex-1 border-0 bg-transparent px-6 py-4 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="mr-2 rounded-full font-bold transition-transform duration-200 hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    Generate
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="pl-6" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
