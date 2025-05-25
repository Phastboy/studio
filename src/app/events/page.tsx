
'use client';

import { useState, useMemo, useEffect } from 'react';
import { EventCard } from '@/components/event/EventCard';
import { EventFilters, type Filters } from '@/components/event/EventFilters';
import { useEventData } from '@/hooks/useEventData';
import type { Event } from '@/types/event';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AllEventsPage() {
  const { allEvents, isLoading, toggleSaveEvent, isEventSaved, deleteEvent } = useEventData();
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    date: undefined,
    category: 'all',
  });

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter(event => {
        const keywordMatch = filters.keyword.toLowerCase()
          ? event.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            event.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            event.location.toLowerCase().includes(filters.keyword.toLowerCase())
          : true;
        
        const dateMatch = filters.date
          ? format(new Date(event.date), 'yyyy-MM-dd') === format(filters.date, 'yyyy-MM-dd')
          : true;
        
        const categoryMatch = filters.category !== 'all'
          ? event.category === filters.category
          : true;
        
        return keywordMatch && dateMatch && categoryMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.time.localeCompare(a.time)); // Sort by date (newest first), then time
  }, [allEvents, filters]);

  const handleToggleSave = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const nowSaved = toggleSaveEvent(eventId);
    toast({
      title: nowSaved ? 'Event Saved!' : 'Event Unsaved',
      description: `"${event.name}" has been ${nowSaved ? 'added to' : 'removed from'} your calendar.`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    if (confirm(`Are you sure you want to delete "${event?.name}"? This action cannot be undone.`)) {
        deleteEvent(eventId);
        toast({
          title: 'Event Deleted',
          description: `"${event?.name}" has been deleted.`,
        });
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
        <Button asChild>
          <Link href="/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Event
          </Link>
        </Button>
      </div>

      <EventFilters filters={filters} setFilters={setFilters} />

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={isEventSaved(event.id)}
              onToggleSave={handleToggleSave}
              onDelete={handleDeleteEvent} // Add delete handler
              showDelete={false} // Do not show delete on main page, only on calendar for "unsave"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground">No Events Found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or create a new event.
          </p>
        </div>
      )}
    </div>
  );
}
