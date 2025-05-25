'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format, parse } from 'date-fns';
import type { Event, EventLink } from '@/types/event';
import { EventCategories, type EventCategory } from '@/types/event';
import { generateEventDescription } from '@/ai/flows/generate-event-description';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const eventFormSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters.'),
  date: z.date({ required_error: 'Event date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM). Example: 14:30'),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  category: z.enum(EventCategories, { required_error: 'Category is required.' }),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  links: z.array(
    z.object({
      label: z.string().min(1, 'Link label cannot be empty.'),
      url: z.string().url('Invalid URL format.'),
    })
  ).optional(),
  // Fields for AI generation
  aiKeywords: z.string().optional(),
  aiDetails: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  onSubmit: (data: EventFormValues) => void;
  initialData?: Partial<Event>; // For editing, not implemented in this scaffold
  isLoading?: boolean;
}

export function EventForm({ onSubmit, initialData, isLoading: isSubmitting }: EventFormProps) {
  const { toast } = useToast();
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      date: initialData?.date ? parse(initialData.date, 'yyyy-MM-dd', new Date()) : new Date(),
      time: initialData?.time || '',
      location: initialData?.location || '',
      category: initialData?.category as EventCategory || EventCategories[0],
      description: initialData?.description || '',
      links: initialData?.links || [{ label: '', url: '' }],
      aiKeywords: '',
      aiDetails: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const handleGenerateDescription = async () => {
    const keywords = form.getValues('aiKeywords');
    const details = form.getValues('aiDetails');

    if (!keywords || !details) {
      toast({
        title: 'Missing Information',
        description: 'Please provide keywords and details for AI generation.',
        variant: 'destructive',
      });
      return;
    }

    setIsAiGenerating(true);
    try {
      const result = await generateEventDescription({ keywords, details });
      if (result.description) {
        form.setValue('description', result.description);
        toast({
          title: 'Description Generated',
          description: 'AI has suggested an event description.',
        });
      } else {
        throw new Error('Empty description returned');
      }
    } catch (error) {
      console.error('AI Description Generation Error:', error);
      toast({
        title: 'AI Generation Failed',
        description: 'Could not generate description. Please try again or write manually.',
        variant: 'destructive',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };
  
  const onFormSubmit = (data: EventFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Summer Music Festival" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EventCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time (HH:MM)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 18:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Central Park Amphitheater" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
          <h3 className="text-lg font-medium text-foreground">AI Description Helper</h3>
           <FormField
            control={form.control}
            name="aiKeywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords for AI</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., live music, food trucks, family-friendly" {...field} />
                </FormControl>
                <FormDescription>Comma-separated keywords to guide the AI.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aiDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Details for AI</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Featuring 5 bands, special craft beer tent, kids zone available." {...field} />
                </FormControl>
                 <FormDescription>Any other important details for the AI.</FormDescription>
              </FormItem>
            )}
          />
          <Button type="button" onClick={handleGenerateDescription} disabled={isAiGenerating} variant="outline">
            {isAiGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us more about the event..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Relevant Links (Optional)</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2 mt-2 p-3 border rounded-md">
              <FormField
                control={form.control}
                name={`links.${index}.label`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Link Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tickets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`links.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                     <FormLabel className="text-xs">Link URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/tickets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ label: '', url: '' })}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
