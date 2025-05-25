
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm, type EventFormValues } from '@/components/event/EventForm';
import { useEventData } from '@/hooks/useEventData';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateEventPage() {
  const router = useRouter();
  const { addEvent } = useEventData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    try {
      const newEventData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'), // Format date to string for storage
        links: data.links?.filter(link => link.label && link.url) // Filter out empty links
      };
      addEvent(newEventData);
      toast({
        title: 'Event Created!',
        description: `"${data.name}" has been successfully created.`,
      });
      router.push('/events'); // Redirect to all events page
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create New Event</CardTitle>
          <CardDescription>Fill in the details below to add a new event to Eventide.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
