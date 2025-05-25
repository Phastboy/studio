
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const createPostSchema = z.object({
  author: z.string().min(1, 'Name is required.').max(50, 'Name is too long.'),
  content: z.string().min(1, 'Post content cannot be empty.').max(280, 'Post is too long (max 280 characters).'),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

interface CreatePostFormProps {
  onSubmit: (data: CreatePostFormValues) => Promise<void>;
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      author: '',
      content: '',
    },
  });

  const handleSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    setIsSubmitting(true);
    await onSubmit(data);
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="What's your name?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's happening?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about events or anything else..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Post
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
