
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Shop } from '@/types/shop';

const shopFormSchema = z.object({
  name: z.string().min(3, 'Shop name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  ownerId: z.string().min(1, 'Owner Identifier is required (placeholder).'), 
});

export type ShopFormValues = z.infer<typeof shopFormSchema>;

interface ShopFormProps {
  onSubmit: (data: ShopFormValues) => void;
  initialData?: Shop;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ShopForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  submitButtonText = initialData ? "Update Shop" : "Create Shop" 
}: ShopFormProps) {
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      ownerId: initialData?.ownerId || '',
    },
  });
  
  const onFormSubmit = (data: ShopFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Eventide Emporium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe what this shop sells..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Identifier (Placeholder)</FormLabel>
              <FormControl>
                <Input placeholder="Enter an ID for the owner" {...field} />
              </FormControl>
              <FormDescription>
                This is a placeholder. Actual user ownership will be linked when auth is integrated.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
