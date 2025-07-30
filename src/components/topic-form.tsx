
'use client';

import { useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Sparkles, Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';


const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  image: z.instanceof(FileList).optional(),
  deepThink: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

interface TopicFormProps {
  onGenerate: (values: FormValues) => void;
  isLoading: boolean;
}

export function TopicForm({ onGenerate, isLoading }: TopicFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      image: undefined,
      deepThink: false,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onGenerate(data);
    form.reset();
    setImagePreview(null);
    if (imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      form.setValue('image', files);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', undefined);
    if(imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded-2xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                      <Textarea
                        placeholder="e.g., Photosynthesis, or describe an image..."
                        className="min-h-[60px] resize-none border-0 bg-transparent p-4 text-base shadow-none focus-visible:ring-0"
                        disabled={isLoading}
                        {...field}
                      />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between p-2 pt-0">
                <div className="flex items-center gap-2">
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-muted-foreground"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isLoading}
                    >
                        <ImageIcon className="h-5 w-5" />
                    </Button>
                     {/* Hidden File Input */}
                    <Input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        disabled={isLoading}
                    />
                </div>
                <Button
                    type="submit"
                    size="lg"
                    className="rounded-full font-bold transition-transform duration-200 hover:scale-105"
                    disabled={isLoading || !form.formState.isValid}
                >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    Generate
                </Button>
            </div>
        </div>
        
        <FormField
            control={form.control}
            name="topic"
            render={() => <FormMessage className="pl-4" />}
        />

        {imagePreview && (
            <div className="relative mx-auto mt-4 w-fit rounded-lg border p-2">
                <Image src={imagePreview} alt="Image preview" width={100} height={100} className="rounded" />
                <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}

        <FormField
          control={form.control}
          name="deepThink"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-center gap-4 rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Deep Think
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Enable for more comprehensive and detailed answers.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
