
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SendHorizonal, Loader2 } from 'lucide-react';

const messageFormSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty.').max(1000, 'Message too long.'),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

interface MessageInputFormProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export function MessageInputForm({ onSendMessage, isLoading }: MessageInputFormProps) {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { text: '' },
  });

  const onSubmit: SubmitHandler<MessageFormValues> = (data) => {
    onSendMessage(data.text);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 p-4 border-t bg-background">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type a message..."
                  className="min-h-[40px] max-h-[120px] resize-none rounded-full px-4 py-2.5 border-input focus-visible:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={isLoading || !form.formState.isValid}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizonal className="h-5 w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </Form>
  );
}
