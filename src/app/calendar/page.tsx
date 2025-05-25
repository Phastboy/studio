
'use client';

import { EventCard } from '@/components/event/EventCard';
import { useEventData } from '@/hooks/useEventData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarHeart, AlertTriangle, Loader2, Trash2 } from 'lucide-react';

export default function MyCalendarPage() {
  const { savedEvents, isLoading, toggleSaveEvent, isEventSaved, deleteEvent } = useEventData();
  const { toast } = useToast();

  const handleUnsaveEvent = (eventId: string) => {
    const event = savedEvents.find(e => e.id === eventId);
    if (!event) return;
    
    toggleSaveEvent(eventId); // This will unsave it
    toast({
      title: 'Event Removed',
      description: `"${event.name}" has been removed from your calendar.`,
    });
  };

   // If you want a hard delete from calendar page:
  const handleDeleteEventFromCalendar = (eventId: string) => {
    const event = savedEvents.find(e => e.id === eventId);
    if (!event) return;

    if (confirm(`Are you sure you want to permanently delete "${event.name}" from all records? This action cannot be undone.`)) {
      deleteEvent(eventId); // This deletes the event entirely
      toast({
        title: 'Event Deleted',
        description: `"${event.name}" has been permanently deleted.`,
        variant: 'destructive'
      });
    }
  };


  if (isLoading) {
    return (
       <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading your calendar...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <CalendarHeart className="mr-3 h-8 w-8 text-primary" /> My Saved Events
        </h1>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={true} // All events here are saved
              onToggleSave={handleUnsaveEvent} // This will act as "Remove from Calendar"
              onDelete={handleDeleteEventFromCalendar} // Optional: if you want hard delete
              showDelete={true} // Show the remove/delete button
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg shadow p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Your Calendar is Empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            You haven't saved any events yet. Explore events and add them to your calendar!
          </p>
          <Button asChild>
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
