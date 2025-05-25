
import type { Event } from '@/types/event';
import { mockEvents } from '@/lib/mockData'; // Import mock data

const EVENTS_STORAGE_KEY = 'eventide_events';
const SAVED_EVENTS_STORAGE_KEY = 'eventide_saved_event_ids';

export const getEventsFromStorage = (): Event[] => {
  if (typeof window === 'undefined') return [];
  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (storedEvents) {
    try {
      return JSON.parse(storedEvents);
    } catch (e) {
      console.error("Failed to parse events from storage, returning empty.", e);
      localStorage.removeItem(EVENTS_STORAGE_KEY); // Clear corrupted data
      saveEventsToStorage(mockEvents); // Initialize with mock data
      return mockEvents;
    }
  } else {
    // No events in storage, initialize with mock data
    saveEventsToStorage(mockEvents);
    return mockEvents;
  }
};

export const saveEventsToStorage = (events: Event[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

export const addEventToStorage = (event: Event): Event[] => {
  const events = getEventsFromStorage();
  const updatedEvents = [event, ...events];
  saveEventsToStorage(updatedEvents);
  return updatedEvents;
};

export const updateEventInStorage = (updatedEvent: Event): Event[] => {
  let events = getEventsFromStorage();
  events = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
  saveEventsToStorage(events);
  return events;
};

export const deleteEventFromStorage = (eventId: string): Event[] => {
  let events = getEventsFromStorage();
  events = events.filter(event => event.id !== eventId);
  saveEventsToStorage(events);
  return events;
};


export const getSavedEventIdsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  const storedIds = localStorage.getItem(SAVED_EVENTS_STORAGE_KEY);
  try {
    return storedIds ? JSON.parse(storedIds) : [];
  } catch (e) {
    console.error("Failed to parse saved event IDs from storage, returning empty.", e);
    localStorage.removeItem(SAVED_EVENTS_STORAGE_KEY); // Clear corrupted data
    return [];
  }
};

export const saveSavedEventIdsToStorage = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVED_EVENTS_STORAGE_KEY, JSON.stringify(ids));
};

export const addSavedEventIdToStorage = (eventId: string): string[] => {
  const ids = getSavedEventIdsFromStorage();
  if (!ids.includes(eventId)) {
    const updatedIds = [...ids, eventId];
    saveSavedEventIdsToStorage(updatedIds);
    return updatedIds;
  }
  return ids;
};

export const removeSavedEventIdFromStorage = (eventId: string): string[] => {
  let ids = getSavedEventIdsFromStorage();
  ids = ids.filter(id => id !== eventId);
  saveSavedEventIdsToStorage(ids);
  return ids;
};
