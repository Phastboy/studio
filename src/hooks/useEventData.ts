
import { useState, useEffect, useCallback, useMemo } from 'react'; // Added React.useMemo
import type { Event } from '@/types/event';
import {
  getEventsFromStorage,
  addEventToStorage,
  updateEventInStorage,
  deleteEventFromStorage,
  getSavedEventIdsFromStorage,
  addSavedEventIdToStorage,
  removeSavedEventIdFromStorage,
} from '@/lib/eventStore';

export function useEventData() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllEvents(getEventsFromStorage());
    setSavedEventIds(getSavedEventIdsFromStorage());
    setIsLoading(false);
  }, []);

  const addEvent = useCallback((newEvent: Omit<Event, 'id' | 'createdAt'>) => {
    const eventWithId: Event = {
      ...newEvent,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updatedEvents = addEventToStorage(eventWithId);
    setAllEvents(updatedEvents);
    return eventWithId;
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
    const updatedEvents = updateEventInStorage(updatedEvent);
    setAllEvents(updatedEvents);
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    const updatedEvents = deleteEventFromStorage(eventId);
    setAllEvents(updatedEvents);
    // Also remove from saved if it was saved
    const updatedSavedIds = removeSavedEventIdFromStorage(eventId);
    setSavedEventIds(updatedSavedIds);
  }, []);

  const toggleSaveEvent = useCallback((eventId: string) => {
    let updatedIds;
    if (savedEventIds.includes(eventId)) {
      updatedIds = removeSavedEventIdFromStorage(eventId);
    } else {
      updatedIds = addSavedEventIdToStorage(eventId);
    }
    setSavedEventIds(updatedIds);
    return !savedEventIds.includes(eventId); // Returns true if event is now saved
  }, [savedEventIds]);

  const isEventSaved = useCallback((eventId: string) => {
    return savedEventIds.includes(eventId);
  }, [savedEventIds]);

  const savedEvents = useMemo(() => {
    return allEvents.filter(event => savedEventIds.includes(event.id)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time));
  }, [allEvents, savedEventIds]);
  
  return {
    allEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    savedEventIds,
    toggleSaveEvent,
    isEventSaved,
    savedEvents,
    isLoading,
  };
}
