
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
import { useCommentData } from '@/hooks/useCommentData';
import { useToast } from '@/hooks/use-toast';

const commentFormSchema = z.object({
  author: z.string().min(1, 'Name is required.').max(50, 'Name is too long.'),
  content: z.string().min(1, 'Comment cannot be empty.').max(280, 'Comment is too long (max 280 characters).'),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onCommentAdded?: () => void; // Optional: callback after comment is added (e.g., to close form)
  placeholder?: string;
  submitButtonText?: string;
}

export function CommentForm({ 
  postId, 
  parentId = null, 
  onCommentAdded,
  placeholder = "Write a comment...",
  submitButtonText = "Post Comment" 
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useCommentData();
  const { toast } = useToast();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      author: '',
      content: '',
    },
  });

  const handleSubmit: SubmitHandler<CommentFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      addComment({
        postId,
        parentId,
        author: data.author,
        content: data.content,
      });
      toast({
        title: 'Comment Posted!',
      });
      form.reset();
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 pt-2">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} className="h-9 text-sm" />
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
              <FormLabel className="sr-only">Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className="min-h-[60px] text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
