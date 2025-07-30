
'use client';

import { useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Sparkles, Loader2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';


const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  image: z.instanceof(FileList).optional(),
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
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onGenerate(data);
    form.reset();
    setImagePreview(null);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
        <div className="relative flex w-full items-center rounded-full border-2 border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                      <Input
                        placeholder="e.g., Photosynthesis, Quantum Physics, or describe an image..."
                        className="h-auto flex-1 border-0 bg-transparent px-6 py-4 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        {...field}
                      />
                  </FormControl>
                </FormItem>
              )}
            />
            
             <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormControl>
                             <Input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                ref={imageInputRef}
                                onChange={(e) => {
                                    onChange(e.target.files);
                                    handleImageChange(e);
                                }}
                                {...rest}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => imageInputRef.current?.click()}
                disabled={isLoading}
            >
                <ImageIcon className="h-5 w-5" />
            </Button>

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
        <FormField
            control={form.control}
            name="topic"
            render={() => <FormMessage className="pl-6" />}
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

      </form>
    </Form>
  );
}
