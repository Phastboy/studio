
'use client';

import type { Event } from '@/types/event';
import { EventCard } from '@/components/event/EventCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AlertTriangle } from 'lucide-react';

interface EventsCarouselProps {
  events: Event[];
  isEventSaved: (eventId: string) => boolean;
  onToggleSave: (eventId: string) => void;
}

export function EventsCarousel({ events, isEventSaved, onToggleSave }: EventsCarouselProps) {
  if (!events || events.length === 0) {
    return (
      <div className="mb-8 p-6 bg-card rounded-lg shadow text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No events to display in carousel.</p>
      </div>
    );
  }

  // Show a limited number of events, e.g., the 5 most recent or upcoming
  const eventsToShow = events.slice(0, 5);


  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Featured Events</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 pb-4">
          {eventsToShow.map(event => (
            <div key={event.id} className="w-[350px] max-w-[calc(100vw-2rem)]">
              <EventCard
                event={event}
                isSaved={isEventSaved(event.id)}
                onToggleSave={onToggleSave}
                // No delete button in carousel
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
